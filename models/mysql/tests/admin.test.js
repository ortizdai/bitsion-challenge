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

let bcrypt;

vi.mock('bcrypt', async () => {
    const actual = await vi.importActual('bcrypt');
  
    return {
      ...actual,
      default: {
        ...actual,
        hash: vi.fn()
      }
    };
  });
  

describe('AdminModel', () => {
  let AdminModel;

  beforeAll(async () => {

    bcrypt = await import('bcrypt');
  bcrypt.default.hash.mockReset();
  mockQuery.mockReset();

    mockQuery.mockReset();

    const module = await import('../admin.js');
    AdminModel = module.AdminModel;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return all admins', async () => {
    const mockAdmins = [
      {
        id: '1',
        username: 'admin1',
        email: 'admin1@example.com',
        full_name: 'Admin One',
        password: 'hashedPassword'
      }
    ];

    mockQuery.mockResolvedValue([mockAdmins]);

    const result = await AdminModel.getAllAdmins();

    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT BIN_TO_UUID(id) id, username, email, full_name FROM admin;'
    );
    expect(result).toEqual(mockAdmins);
  });
  it('should create a new admin successfully', async () => {
    const input = {
      full_name: 'Admin One',
      email: 'admin1@example.com',
      username: 'admin1',
      password: 'password123'
    };

    const mockExistingUser = [];
    const mockUuid = '1234-uuid';
    const mockAdminsResult = [
      { id: mockUuid, userName: 'admin1', email: 'admin1@example.com', full_name: 'Admin One' }
    ];
    const mockPasswordHash = 'hashedPassword';
    mockQuery.mockResolvedValueOnce([mockExistingUser]);
    mockQuery.mockResolvedValueOnce([[{ uuid: mockUuid }]]);
    bcrypt.default.hash.mockResolvedValue(mockPasswordHash);
    mockQuery.mockResolvedValueOnce([{}]);
    mockQuery.mockResolvedValueOnce([mockAdminsResult]);

    const result = await AdminModel.createAdmin({ input });

    expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM admin WHERE userName = ?', 
        ['admin1']);
    expect(mockQuery).toHaveBeenCalledWith('SELECT UUID() uuid;');
    expect(mockQuery).toHaveBeenCalledWith(
      `INSERT INTO admin (id, username, email, full_name, password) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?);`,
      [mockUuid, 'admin1', 'admin1@example.com', 'Admin One', mockPasswordHash]
    );
    expect(mockQuery).toHaveBeenCalledWith(
      `SELECT BIN_TO_UUID(id) id, userName, email, full_name FROM admin WHERE id = UUID_TO_BIN(?)`,
      [mockUuid]
    );

    expect(result).toEqual(mockAdminsResult[0]);
  });
});
