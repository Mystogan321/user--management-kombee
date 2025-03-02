import { FaTimes } from 'react-icons/fa';
import { User } from '../types';

interface UserModalProps {
  user: User;
  onClose: () => void;
}

const UserModal = ({ user, onClose }: UserModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center p-6 bg-gray-800 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">VIEW USER</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name:</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email:</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Role:</p>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">DOB:</p>
              <p className="font-medium">{user.dob || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Profile:</p>
              <button className="text-primary hover:text-primary-dark font-medium">
                View
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Gender:</p>
              <p className="font-medium">{user.gender || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status:</p>
              <p className="font-medium">{user.status}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;