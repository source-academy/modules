type TabUiProps = {
  onOpenCanvas: () => void;
};

export default function TabUi({ onOpenCanvas }: TabUiProps) {
  return (
    <div>
      <p>Welcome to robot simulator.</p>
      <button
        onClick={() => {
          onOpenCanvas();
        }}
      >
        Open simulation
      </button>
    </div>
  );
}
