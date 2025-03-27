import React, { useState } from "react";
import { Outlet } from "react-router-dom";

function PrivateRouteWithiutFooterLayout() {
  return (
    <div className="flex min-h-full">
      <div className="flex w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default PrivateRouteWithiutFooterLayout;
