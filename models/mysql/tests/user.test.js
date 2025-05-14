import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

const mockQuery = vi.fn();

vi.mock('mysql2/promise', () => {
  return {
    default: {
      createConnection: async () => ({
        query: mockQuery
      })
    }
  };
});

describe('UserModel', () => {
  let UserModel;

  beforeAll(async () => {
    mockQuery.mockReset();
    const module = await import('../user.js');
    UserModel = module.UserModel;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create a new user successfully', async () => {
    const input = {
      full_name: 'Jane Doe',
      identification: '123456789',
      age: 30,
      gender: 'female',
      state: 'active'
    };

    const mockUuid = 'user-uuid';
    const mockUuidResult = [[{ uuid: mockUuid }]];
    const mockInserted = [{}];
    const mockUserResult = [[{
      id: mockUuid,
      full_name: 'Jane Doe',
      identification: '123456789',
      age: 30,
      gender: 'female',
      state: 'active'
    }]];

    mockQuery.mockResolvedValueOnce(mockUuidResult);
    mockQuery.mockResolvedValueOnce(mockInserted);
    mockQuery.mockResolvedValueOnce(mockUserResult);

    const result = await UserModel.createUser({ input });
    expect(mockQuery).toHaveBeenCalledWith('SELECT UUID() uuid;');
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO user (id, full_name, identification, age, gender, state) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?);`,
      [mockUuid, input.full_name, input.identification, input.age, input.gender, input.state]
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT BIN_TO_UUID(id) id, full_name, identification, age, gender, state FROM user WHERE id = UUID_TO_BIN(?);`,
      [mockUuid]
    );

    expect(result).toEqual(mockUserResult[0][0]);
  });

  it('should update a user successfully', async () => {
    const id = 'user-uuid';
    const input = {
      full_name: 'Jane Doe Updated',
      age: 31,
      gender: 'female',
      state: 'inactive',
      identification: '987654321'
    };

    const mockUpdated = [{}];
    const mockUser = {
      id,
      full_name: input.full_name,
      identification: input.identification,
      age: input.age,
      gender: input.gender,
      state: input.state,
      attributes: []
    };

    mockQuery.mockResolvedValueOnce([mockUpdated]);
    mockQuery.mockResolvedValueOnce([[mockUser]]);

    const result = await UserModel.updateUser({ id, input });

    expect(mockQuery).toHaveBeenCalledWith(
      `UPDATE user SET full_name = ?, age = ?, gender = ?, state = ?, identification = ? WHERE id = UUID_TO_BIN(?)`,
      [
        input.full_name,
        input.age,
        input.gender,
        input.state,
        input.identification,
        id
      ]
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT 
      BIN_TO_UUID(u.id) AS id,
      u.full_name,
      u.identification,
      u.age,
      u.gender,
      u.state,
      a.attribute_name,
      a.attribute_value,
      BIN_TO_UUID(a.id) AS id

    FROM user u
    LEFT JOIN attribute a ON u.id = a.user_id
    WHERE u.id = UUID_TO_BIN(?)`,
      [id]
    );
    expect(result).toEqual(mockUser);
  });

  it('should throw error when updating with no allowed fields', async () => {
    const id = 'user-uuid';
    const input = {
      not_allowed_field: 'ignored'
    };

    await expect(() => UserModel.updateUser({ id, input }))
      .rejects
      .toThrow('Update failed: no matching record found or no changes detected');
  });
});
