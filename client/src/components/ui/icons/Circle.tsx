const Circle = ({ className }: { className?: string }) => {
  return (
    <svg
      className={"text-pink-600 " + className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none"></path>
      <circle cx="12" cy="12" r="9"></circle>
    </svg>
  );
};

export default Circle;
