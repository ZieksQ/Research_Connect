import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator } from 'react-icons/md';

export function SortableItem({ id, children, className = '' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative ${className}`}>
      <div 
        className="absolute top-1/2 -translate-y-1/2 left-1.5 cursor-grab active:cursor-grabbing z-10 text-gray-400 hover:text-custom-blue transition-colors" 
        {...attributes} 
        {...listeners}
      >
        <MdDragIndicator className="text-xl" />
      </div>
      {children}
    </div>
  );
}
