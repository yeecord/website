import Link from "@docusaurus/Link";
import React from "react";

export default function LinkButton({ children, to }) {
  return (
    <div className="buttons w-fit">
      <Link className="button" to={to}>
        {children}
      </Link>
    </div>
  );
}
