const NavbarIcon = ({ children, activeChatMenu, onClick, tooltip = null }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col justify-center items-center w-16 h-16 text-3xl cursor-pointer transition hover:text-accent hover:bg-secondary ${
        activeChatMenu ? "text-accent bg-secondary" : ""
      }`}
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltip}
      data-tooltip-place="right"
    >
      {children}
    </div>
  );
};

export default NavbarIcon;
