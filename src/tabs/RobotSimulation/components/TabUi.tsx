type TabUiProps = {
  onOpenCanvas: () => void;
};

export default function TabUi({ onOpenCanvas }: TabUiProps) {
  return (
    <div>
      <button
        onClick={() => {
          onOpenCanvas();
        }}
      >
        Open canvas
      </button>
    </div>
  );
}
