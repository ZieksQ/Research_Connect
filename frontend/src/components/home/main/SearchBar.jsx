import { MdSearch } from 'react-icons/md';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="form-control mb-4 lg:mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdSearch className="text-xl text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Filter Surveys"}
          className="input input-bordered w-full pl-10 bg-white border-gray-200 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
