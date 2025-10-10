import React from "react";

const Chat = ({ data }: { data: string }) => {
  return (
    <div className="grow flex-1 flex flex-col  overflow-y-auto my-8 lg:w-[60%] md:w-3/4 w-11/12  gap-3 mb-64 [&::-webkit-scrollbar]:hidden">
      <div className="bg-foreground text-muted  rounded-lg  w-fit text-base font-semibold  flex justify-center items-center py-1.5 px-3 self-end">
        Explain how AI works in a few words
      </div>
      <div className="text-foreground  rounded-lg  w-fit text-base font-semibold  flex justify-center items-center py-1.5 px-3">
        {data}
      </div>
    </div>
  );
};

export default Chat;
