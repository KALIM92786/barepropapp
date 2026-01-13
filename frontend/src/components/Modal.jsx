export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        {title && <h3 className="text-lg font-bold text-white mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}