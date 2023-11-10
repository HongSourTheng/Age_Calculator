import React, { useEffect, useReducer, useRef } from "react";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
const defaultValue = {
  day: "",
  month: "",
  year: "",
  isSubmit: false,
  isConfirm: false,
  isInvalidDate: false,
  isInvalidDay: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "STYLE":
      return { ...state, isSubmit: true };
    case "INVALID_DATE":
      return { ...state, isInvalidDate: true, isSubmit: true };
    case "INVALID_DAY":
      return { ...state, isInvalidDay: true };
    case "RESET_FORM":
      return { ...defaultValue };
    case "CT_NUM":
      return {
        ...state,
        [action.payload.fld]: action.payload.value,
        isInvalidDate: false,
        isInvalidDay: false,
      };
    case "CALCULATE":
      return {
        ...state,
        ...action.payload.value,
        isConfirm: true,
        isInvalidDate: false,
        isInvalidDay: false,
      };
    default:
      return state;
  }
};
const Form = () => {
  const [state, dispatch] = useReducer(reducer, defaultValue);
  const inputRef = {
    formRef: useRef(null),
    inputDay: useRef(null),
    inputMonth: useRef(null),
    inputYear: useRef(null),
  };
  const { formRef, inputDay, inputMonth, inputYear } = inputRef;
  const {
    day,
    month,
    year,
    isSubmit,
    isConfirm,
    diffInDays,
    diffInMonths,
    diffInYears,
    isInvalidDate,
    isInvalidDay,
  } = state;

  useEffect(() => {
    inputDay.current.focus();
  }, [diffInDays, diffInMonths, diffInYears]);

  useEffect(() => {
    function enterKey(e) {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
    }
    // Add an event listener to the document
    document.addEventListener("keyup", enterKey);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keyup", enterKey);
    };
  }, [day, month, year, diffInDays, diffInMonths, diffInYears]);

  const labelStyle = {
    color: isSubmit ? "red" : "hsl(0, 1%, 44%)",
    opacity: isSubmit ? 1 : 0.7,
    marginBottom: isSubmit ? "2px" : "0px",
  };

  const inputStyle = {
    border: isSubmit ? "1px solid red" : "1px solid hsl(0, 0%, 94%)",
  };
  const requiredValue = isSubmit ? "This field is required" : null;

  function handleNumberOnly(e, fld) {
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numeric input

    dispatch({ type: "CT_NUM", payload: { fld, value: inputValue } });
  }
  function handleSubmit(e) {
    e.preventDefault();
    formRef.current.submit;
    if (day === "" || month === "" || year === "") {
      if (day === "") {
        inputDay.current.focus();
      } else if (month === "") {
        inputMonth.current.focus();
      } else if (year === "") {
        inputYear.current.focus();
      }

      dispatch({ type: "STYLE" });
    } else if (day > 31 || month > 12 || year > 2023) {
      dispatch({ type: "INVALID_DATE" });
    } else if (
      (parseInt(month) === 4 && parseInt(day) > 30) ||
      (parseInt(month) === 2 && parseInt(day) > 29)
    ) {
      dispatch({ type: "INVALID_DAY" });
    } else {
      const diffInDays = Math.floor(
        differenceInDays(new Date(year, month, 31), new Date(year, month, day))
      );
      const diffInMonths = differenceInMonths(
        new Date(year, 12, 31),
        new Date(year, month, day)
      );

      const diffInYears = differenceInYears(
        new Date(2023, 12, 31),
        new Date(year, month, day)
      );

      dispatch({
        type: "CALCULATE",
        payload: { value: { diffInDays, diffInMonths, diffInYears } },
      });
    }
  }

  return (
    <>
      <div className="form-box">
        <form action="" ref={formRef}>
          <div className="item-box">
            <label
              htmlFor=""
              style={!day ? labelStyle : isInvalidDate ? labelStyle : null}
            >
              DAY
            </label>
            <input
              ref={inputDay}
              style={!day ? inputStyle : isInvalidDate ? inputStyle : null}
              type="text"
              name=""
              id=""
              maxLength={2}
              placeholder="DD"
              value={day}
              onChange={(e) => handleNumberOnly(e, "day")}
            />

            <p>{day ? null : requiredValue}</p>
            <p>
              {day > 31
                ? "Must be a valid day"
                : isInvalidDay
                ? "Must be a valid date"
                : null}
            </p>
          </div>
          <div className="item-box">
            <label
              htmlFor=""
              style={!month ? labelStyle : isInvalidDate ? labelStyle : null}
            >
              MONTH
            </label>
            <input
              ref={inputMonth}
              style={!month ? inputStyle : isInvalidDate ? inputStyle : null}
              type="text"
              name=""
              id=""
              maxLength={2}
              placeholder="MM"
              value={month}
              onChange={(e) => handleNumberOnly(e, "month")}
            />
            <p>{month ? null : requiredValue}</p>
            <p>{month > 12 ? "Must be a valid month" : null}</p>
          </div>
          <div className="item-box">
            <label
              htmlFor=""
              style={!year ? labelStyle : isInvalidDate ? labelStyle : null}
            >
              YEAR
            </label>

            <input
              ref={inputYear}
              style={!year ? inputStyle : isInvalidDate ? inputStyle : null}
              type="text"
              name=""
              id=""
              maxLength={4}
              placeholder="YYYY"
              value={year}
              onChange={(e) => handleNumberOnly(e, "year")}
            />
            <p>{year ? null : requiredValue}</p>
            <p>{year > 2023 ? "Must be in the past" : null}</p>
          </div>
        </form>
        <button className="btn-click" type="submit" onClick={handleSubmit}>
          <i className="fa-solid fa-arrow-down"></i>
        </button>
      </div>
      <div className="birth-box">
        <div className="text-box">
          <span>{isConfirm ? diffInYears : "- -"}</span>
          <h1>years</h1>
        </div>
        <div className="text-box">
          <span>{isConfirm ? diffInMonths : "- -"}</span>
          <h1>months</h1>
        </div>
        <div className="text-box">
          <span>{isConfirm ? diffInDays : "- -"}</span>
          <h1>days</h1>
        </div>
      </div>
    </>
  );
};

export default Form;
