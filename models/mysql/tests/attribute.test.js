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

describe('AttributeModel', () => {
  let AttributeModel;

  beforeAll(async () => {
    mockQuery.mockReset();

    const module = await import('../attribute.js');
    AttributeModel = module.AttributeModel;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return all attributes', async () => {
    const mockAttributes = [
      {
        id: 'uuid1',
        user_id: 'useruuid',
        attribute_name: 'color',
        attribute_value: 'blue'
      }
    ];

    mockQuery.mockResolvedValue([mockAttributes]);

    const result = await AttributeModel.getAllAttributes();

    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, attribute_name, attribute_value
      FROM attribute;`
    );
    expect(result).toEqual(mockAttributes);
  });

  it('should create new attributes for a user', async () => {
    const input = {
      user_id: 'user-uuid',
      attributes: [
        { name: 'height', value: '180' },
        { name: 'weight', value: '75' }
      ]
    };

    const mockUserExists = [{}];
    const mockInserted = [{}];
    const mockFinalAttributes = [
      { id: 'attr-uuid-1', user_id: 'user-uuid', attribute_name: 'height', attribute_value: '180' },
      { id: 'attr-uuid-2', user_id: 'user-uuid', attribute_name: 'weight', attribute_value: '75' }
    ];

    mockQuery.mockResolvedValueOnce([mockUserExists]);
    mockQuery.mockResolvedValueOnce([mockInserted]);
    mockQuery.mockResolvedValueOnce([mockInserted]);
    mockQuery.mockResolvedValueOnce([mockFinalAttributes]);

    const result = await AttributeModel.createAttribute({ input });

    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM user WHERE id = UUID_TO_BIN(?)',
      ['user-uuid']
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO attribute (id, user_id, attribute_name, attribute_value)
            VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?);`,
      ['user-uuid', 'height', '180']
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO attribute (id, user_id, attribute_name, attribute_value)
            VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?, ?);`,
      ['user-uuid', 'weight', '75']
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, attribute_name, attribute_value
         FROM attribute WHERE user_id = UUID_TO_BIN(?)`,
      ['user-uuid']
    );

    expect(result).toEqual(mockFinalAttributes);
  });
});
