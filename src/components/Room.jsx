"use client";
import React, { useState } from "react";
import "@material/web/textfield/filled-text-field";

export default function Room({ code }) {
  const [link] = useState(`https://localhost:3000/rooms/${code}`);

  return (
    <div>
      <md-filled-text-field value={link} readOnly type="text"></md-filled-text-field>
    </div>
  );
}
