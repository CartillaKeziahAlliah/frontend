// src/components/AnnouncementCard.js

import React from "react";
import { Button } from "@mui/material";
import { DeleteForeverRounded, Mail } from "@mui/icons-material";

const AnnouncementCard = ({ announcement, index, onDelete, onMarkAsRead }) => {
  return (
    <div
      className={`${
        announcement.isRead
          ? "bg-[beige] flex flex-row gap-2 justify-between w-full"
          : "bg-[white] flex flex-row gap-2 justify-between w-full"
      }`}
    >
      <div className="flex flex-row gap-2 w-full">
        <div className="w-[10%]">
          <img className="w-full" src={announcement.profile} alt="" />
        </div>
        <div className="border-b border-b-black flex flex-row justify-between w-full">
          <div>
            <h1 className="text-[green] font-bold capitalize">
              {announcement.personName}
            </h1>
            <b>{announcement.role}</b>
            <p>{announcement.content}</p>
          </div>
          <div>
            <Button onClick={() => onDelete(index)}>
              <DeleteForeverRounded />
            </Button>
            {!announcement.isRead && (
              <Button
                variant="text"
                onClick={() => onMarkAsRead(index)}
                sx={{ padding: "10px", width: "20%" }}
              >
                <Mail />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
