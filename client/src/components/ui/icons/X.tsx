const X = ({ className }: { className?: string }) => {
  return (
    <svg
      className={"text-cyan-600 " + className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <line x1="20" x2="4" y1="4" y2="20" />
      <line x1="4" x2="20" y1="4" y2="20" />
    </svg>
  );
};

export default X;
