"use client";

export function CardPurchasedCourse(props) {
  return (
    <div className="py-8 grid grid-cols-4 gap-16">
      <div className="border rounded-tl-xl rounded-tr-[48px] rounded-bl-[48px] rounded-br-xl py-8 px-2">
        <h1 className="font-semibold text-xl pb-6 px-4">
            {props.title}
        </h1>
        <p className="text-sm py-2 px-4">
          {props.description}
        </p>
        <p className="text-sm py-4 px-4">{props.date}</p>
      </div>
    </div>
  );
}

export default CardPurchasedCourse;
