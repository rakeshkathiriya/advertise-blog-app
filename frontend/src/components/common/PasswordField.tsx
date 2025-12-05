import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PasswordFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | undefined;
  touched?: boolean | undefined;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  value,
  onChange,
  onBlur,
  touched,
  error,
  placeholder = '••••••••',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      <div className="relative">
        <input
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          onCopy={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          className={`mt-1 w-full rounded-lg border bg-gray-50 p-3 pr-12 ${touched && error ? 'border-red-500' : 'border-gray-300'} `}
        />

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Error Message */}
      <p className="mt-1 min-h-5 text-xs text-red-500">{touched && error ? error : ''}</p>
    </div>
  );
};

export default PasswordField;
