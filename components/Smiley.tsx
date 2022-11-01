import * as React from "react";

export function Smiley() {
  return (
    <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="a"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={24}
        height={24}
      >
        <path d="M24 0H0v24h24V0Z" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path
          d="M12.302 22.797c5.998 0 10.86-4.862 10.86-10.86 0-5.997-4.862-10.859-10.86-10.859-5.997 0-10.859 4.862-10.859 10.86 0 5.997 4.862 10.859 10.86 10.859Z"
          stroke="#000"
        />
      </g>
      <mask
        id="b"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={1}
        y={0}
        width={23}
        height={24}
      >
        <path d="M23.438.802H1.167v22.271h22.271V.802Z" fill="#fff" />
      </mask>
      <g mask="url(#b)">
        <path
          d="M4.701 11.766a7.6 7.6 0 0 0 7.601 7.601 7.6 7.6 0 0 0 7.601-7.6"
          stroke="#000"
        />
      </g>
      <mask
        id="c"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={1}
        y={0}
        width={23}
        height={24}
      >
        <path d="M23.438.802H1.167v22.271h22.271V.802Z" fill="#fff" />
      </mask>
      <g mask="url(#c)">
        <path
          d="M7.838 9.487c.83 0 1.505-.675 1.505-1.505 0-.83-.675-1.504-1.505-1.504-.83 0-1.505.675-1.505 1.504 0 .836.675 1.505 1.505 1.505Z"
          fill="#000"
        />
      </g>
      <mask
        id="d"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={1}
        y={0}
        width={23}
        height={24}
      >
        <path d="M23.438.802H1.167v22.271h22.271V.802Z" fill="#fff" />
      </mask>
      <g mask="url(#d)">
        <path
          d="M16.761 9.487c.83 0 1.505-.675 1.505-1.505 0-.83-.675-1.504-1.505-1.504-.83 0-1.505.675-1.505 1.504a1.506 1.506 0 0 0 1.505 1.505Z"
          fill="#000"
        />
      </g>
    </svg>
  );
}
