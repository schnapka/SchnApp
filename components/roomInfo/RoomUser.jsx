const RoomUser = ({ roomUser }) => {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 ml-4 cursor-pointer transition hover:text-accent hover:bg-primary"
      data-tooltip-id="tooltip"
      data-tooltip-place="right"
      data-tooltip-html={`<div class="flex items-center py-2 gap-5">
                            <img class="rounded-full max-w-40" src="${roomUser.avatar_url}" alt="${roomUser.full_name}"/>
                            <div>
                              <div class="text-xl text-secondary">
                                ${roomUser.full_name}
                              </div>
                              <div class="text-xs text-secondary">
                                ${roomUser.email}
                              </div>
                            </div>
                          </div>`}
    >
      <div className="w-6 h-6 rounded-full overflow-hidden">
        {roomUser.avatar_url ? (
          <img className="w-full h-full object-contain" src={roomUser.avatar_url} alt={roomUser.full_name} />
        ) : (
          <div className="flex justify-center items-center uppercase text-primary bg-accent">{roomUser.nickname[0]}</div>
        )}
      </div>
      <span className="text-sm">{roomUser.nickname}</span>
    </div>
  );
};

export default RoomUser;
