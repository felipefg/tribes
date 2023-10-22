"use client";

export function CardCreatorsDashboard(props) {
  return (
    <div className="py-4 grid grid-cols-4 gap-16 relative z-10">
      <button className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
        <h1 className="font-semibold text-xl pb-6 px-4">
          {props.title}
        </h1>
        <div className="grid grid-cols-2 gap-4 py-2 justify-center items-start px-4">
          <div className="flex flex-col justify-center items-center py-2 w-32">
            <h1 className="text-2xl font-medium">{props.rate}</h1>
            <p className="text-sm text-center">Maximum rate of return</p>
          </div>
          <div className="flex flex-col justify-center items-center py-2 w-32">
            <h1 className="text-2xl font-medium">{props.percentage_raised}</h1>
            <p className="text-sm text-center">Percentage raised</p>
          </div>
        </div>
        <h1 className="text-sm font-medium pt-2 pl-4">Description:</h1>
        <p className="text-sm p-1 pl-4">
          {props.description}
        </p>
        <div className="flex justify-center items-center w-full py-1 mt-4 bg-purple rounded-lg">
          Finished
        </div>
      </button>
    </div>
  );
}

export default CardCreatorsDashboard;
