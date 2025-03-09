export const ContextMenu = (props) => {
  return (
    <div className="context_menu" style={{ top: props.top, left: props.left }}>
      {props.children}
    </div>
  );
};
