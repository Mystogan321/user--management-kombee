import { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSort, FaFilter, FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import { CSVLink } from 'react-csv';
import { useUsers } from '../hooks/useUsers';
import { Role, User } from '../types';
import UserModal from './UserModal';
import UserForm from './UserForm';
import Loader from './Loader';
import clsx from 'clsx';

const UserTable = () => {
  const {
    currentPageUsers,
    isLoading,
    currentPage,
    totalPages,
    selectedUsers,
    sortField,
    sortDirection,
    roleFilter,
    searchTerm,
    areAllSelected,
    toggleSelectUser,
    toggleSelectAll,
    setCurrentPage,
    deleteUser,
    deleteMultipleUsers,
    setSearchTerm,
    setRoleFilter,
    setSortField,
  } = useUsers();

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showMultiDeleteConfirm, setShowMultiDeleteConfirm] = useState(false);

  // CSV export data
  const csvData = [
    ['ID', 'Name', 'Email', 'Role', 'Date of Birth', 'Gender', 'Status'],
    ...currentPageUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.role,
      user.dob || '',
      user.gender || '',
      user.status
    ])
  ];

  const handleSort = (field: string) => {
    setSortField(field);
  };

  const handleDelete = (id: string) => {
    deleteUser(id);
    setShowDeleteConfirm(null);
  };

  const handleMultiDelete = () => {
    deleteMultipleUsers();
    setShowMultiDeleteConfirm(false);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">


      {/* Search and Actions */}
      <div className="flex justify-between mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="flex space-x-2">
          <button
            className="btn btn-primary flex items-center space-x-1"
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus size={14} />
            <span>Add</span>
          </button>
          <button className="btn btn-outline flex items-center space-x-1">
            <FaFilter size={14} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-gray-700"
            >
              <option value="">All Roles</option>
              <option value={Role.ADMIN}>Administrator</option>
              <option value={Role.SUB_ADMIN}>Sub Admin</option>
              <option value={Role.CUSTOMER}>Customer</option>
            </select>
          </button>
          <CSVLink
            data={csvData}
            filename={"users.csv"}
            className="btn btn-outline flex items-center space-x-1"
          >
            <FaFileExport size={14} />
            <span>Export</span>
          </CSVLink>
          {selectedUsers.length > 0 && (
            <button
              className="btn btn-danger flex items-center space-x-1"
              onClick={() => setShowMultiDeleteConfirm(true)}
            >
              <FaTrash size={14} />
              <span>Delete Selected</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        {isLoading && <Loader />}
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header w-12">
                <input
                  type="checkbox"
                  checked={areAllSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th 
                className="table-header cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <FaSort className={clsx(
                    "ml-1",
                    sortField === 'name' && "text-blue-300"
                  )} />
                </div>
              </th>
              <th 
                className="table-header cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <FaSort className={clsx(
                    "ml-1",
                    sortField === 'email' && "text-blue-300"
                  )} />
                </div>
              </th>
              <th className="table-header">Role</th>
              <th className="table-header">DOB</th>
              <th className="table-header">Gender</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-cell text-center py-8">
                  No users found
                </td>
              </tr>
            ) : (
              currentPageUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="table-cell font-medium">{user.name}</td>
                  <td className="table-cell">{user.email}</td>
                  <td className="table-cell">{user.role}</td>
                  <td className="table-cell">{user.dob || '-'}</td>
                  <td className="table-cell">{user.gender || '-'}</td>
                  <td className="table-cell">
                    <span
                      className={clsx(
                        "px-2 py-1 text-xs rounded-full",
                        user.status === 'Active'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewUser(user)}
                        className="text-primary hover:text-primary-dark"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={clsx(
                "pagination-btn",
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              &laquo;
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={clsx(
                "pagination-btn",
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              )}
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={clsx(
                    "pagination-btn",
                    currentPage === pageNum && "pagination-btn-active"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={clsx(
                "pagination-btn",
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              )}
            >
              &gt;
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={clsx(
                "pagination-btn",
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              )}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <UserModal
          user={viewUser}
          onClose={() => setViewUser(null)}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <UserForm
                onClose={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Edit User</h2>
              <button
                onClick={() => setEditUser(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <UserForm
                user={editUser}
                onClose={() => setEditUser(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Delete Confirmation Modal */}
      {showMultiDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Confirm Multiple Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete {selectedUsers.length} selected users? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMultiDeleteConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleMultiDelete}
                className="btn btn-danger"
              >
                Delete All Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;