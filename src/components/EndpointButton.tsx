type Props = {
  name: string;
  path: string;
  hasAccess: boolean;
  loading: boolean;
  onClick: (path: string) => void;
};

export default function EndpointButton({
  name,
  path,
  hasAccess,
  loading,
  onClick,
}: Props) {
  return (
    <button
      onClick={() => onClick(path)}
      disabled={loading}
      className={`p-4 rounded text-white ${
        hasAccess ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <div className="font-bold">{name}</div>
      <div className="text-xs">{path}</div>
    </button>
  );
}
