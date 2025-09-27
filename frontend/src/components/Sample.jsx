import { useState, useRef, useEffect } from "react";

export default function SamplePostCard() {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (expanded) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [expanded]);

  return (
    <div className="p-4 bg-white shadow rounded-xl w-96">
      <h2 className="font-bold text-lg">Post Title</h2>

      {/* Collapsible section */}
      <div
        ref={contentRef}
        style={{ height }}
        className="transition-all duration-500 ease-in-out overflow-hidden"
      >
        <p className="text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed magna
          sit amet sem pellentesque hendrerit sit amet a lorem. Praesent
          fermentum nisi sit amet mi suscipit, nec facilisis est pharetra.
          Integer vitae risus nec libero dapibus varius. Curabitur pulvinar
          libero in eros viverra, sed porta odio pharetra.
        </p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-blue-600 hover:underline"
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}
