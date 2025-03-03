import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUsers } from '../hooks/useUsers';
import { Gender, Role, Status, User, UserFormValues } from '../types';

interface UserFormProps {
  user?: User;
  onClose: () => void;
}

const UserForm = ({ user, onClose }: UserFormProps) => {
  const { addUser, updateUser } = useUsers();
  const isEditMode = !!user;

  // Initial form values
  const initialValues: UserFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || Role.CUSTOMER,
    dob: user?.dob || '',
    gender: user?.gender || undefined,
    status: user?.status || Status.ACTIVE,
    password: '',
    confirmPassword: '',
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    role: Yup.string().required('Role is required'),
    dob: Yup.string().nullable(),
    gender: Yup.string().nullable(),
    status: Yup.string().required('Status is required'),
    password: isEditMode
      ? Yup.string()
      : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: isEditMode
      ? Yup.string().oneOf([Yup.ref('password')], 'Passwords must match')
      : Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  });

  // Form submission handler
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const userData = {
        name: values.name,
        email: values.email,
        role: values.role,
        dob: values.dob,
        gender: values.gender,
        status: values.status,
        password: values.password || (user?.password || ''),
      };

      if (isEditMode && user) {
        updateUser({ ...userData, id: user.id });
      } else {
        addUser(userData);
      }
      
      onClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="input"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="input"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error">{formik.errors.email}</div>
          ) : null}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="label">
            Role
          </label>
          <select
            id="role"
            name="role"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
            className="input"
          >
            <option value={Role.ADMIN}>{Role.ADMIN}</option>
            <option value={Role.SUB_ADMIN}>{Role.SUB_ADMIN}</option>
            <option value={Role.CUSTOMER}>{Role.CUSTOMER}</option>
          </select>
          {formik.touched.role && formik.errors.role ? (
            <div className="error">{formik.errors.role}</div>
          ) : null}
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="label">
            Date of Birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.dob}
            className="input"
          />
          {formik.touched.dob && formik.errors.dob ? (
            <div className="error">{formik.errors.dob}</div>
          ) : null}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="label">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gender || ''}
            className="input"
          >
            <option value="">Select Gender</option>
            <option value={Gender.MALE}>{Gender.MALE}</option>
            <option value={Gender.FEMALE}>{Gender.FEMALE}</option>
            <option value={Gender.OTHER}>{Gender.OTHER}</option>
          </select>
          {formik.touched.gender && formik.errors.gender ? (
            <div className="error">{formik.errors.gender}</div>
          ) : null}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="label">
            Status
          </label>
          <select
            id="status"
            name="status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.status}
            className="input"
          >
            <option value={Status.ACTIVE}>{Status.ACTIVE}</option>
            <option value={Status.INACTIVE}>{Status.INACTIVE}</option>
          </select>
          {formik.touched.status && formik.errors.status ? (
            <div className="error">{formik.errors.status}</div>
          ) : null}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="label">
            Password {isEditMode && '(Leave blank to keep current)'}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="input"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error">{formik.errors.password}</div>
          ) : null}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="input"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="error">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!formik.isValid || formik.isSubmitting}
        >
          {isEditMode ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;