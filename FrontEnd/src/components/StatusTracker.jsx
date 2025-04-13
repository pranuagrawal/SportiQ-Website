import React from "react";
import "../css/StatusTracker.css";
import filledTick from "../assets/myimages/check.png";
import emptyTick from "../assets/myimages/empty_check.png";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

const StatusTracker = ({ currentStatus }) => {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus.toUpperCase());

    return (
        <div className="status-tracker">
            {ORDER_STATUSES.map((status, index) => (
                <React.Fragment key={status}>
                    {index !== 0 && (
                        <div className={`status-line ${index <= currentIndex ? "active" : ""}`} />
                    )}
                    <div className="status-step">
                    <img
    src={index <= currentIndex ? filledTick : emptyTick}
    alt="status"
    className={`status-dot ${index > currentIndex ? "empty-tick" : ""}`}
/>

                        <div className="status-label-wrapper">
                            <span className={`status-label ${index <= currentIndex ? "active" : ""}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default StatusTracker;
