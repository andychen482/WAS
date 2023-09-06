import { render } from "@testing-library/react";
import { Course, Section } from "../CourseUI/CourseTypes";
import "./CalendarStyle.css";
import { ViewState } from "@devexpress/dx-react-scheduler";
import { Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import { amber, deepOrange, grey, indigo } from "@mui/material/colors";
import moment from "moment";
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
} from "@devexpress/dx-react-scheduler-material-ui";

const currentDate = moment().format("YYYY-MM-DD");
const schedulerData = [
  {
    startDate: moment().format("YYYY-MM-DD") + "T09:45",
    endDate: moment().format("YYYY-MM-DD") + "T11:00",
    title: "Test class",
  },
  {
    startDate: moment().format("YYYY-MM-DD") + "T12:00",
    endDate: moment().format("YYYY-MM-DD") + "T13:30",
    title: "Test session",
  },
];

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      ...indigo,
      ...(mode === "dark" && {
        main: indigo[400],
      }),
    },
    ...(mode === "dark" && {
      background: {
        default: grey[900],
        paper: grey[900],
      },
    }),
    text: {
      ...{
        primary: "#fff",
        secondary: grey[500],
      },
    },
  },
});

const darkModeTheme = createTheme(getDesignTokens("dark"));

interface CalendarProps {
  selectedCourses: Course[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedCourses }) => {
  return (
    <div className="calendar-container">
      <div className="centered-text text-2xl text-white">WIP</div>
      <ThemeProvider theme={darkModeTheme}>
        <div className="schedule">
          <Paper>
            <Scheduler data={schedulerData}>
              <ViewState currentDate={currentDate} />
              <WeekView
                startDayHour={7}
                endDayHour={19.5}
                intervalCount={1}
                cellDuration={60}
                excludedDays={[0, 6]}
              />
              <Appointments />
            </Scheduler>
          </Paper>
        </div>
      </ThemeProvider>
      {selectedCourses.map((course) => {
        return (
          <div
            key={course.name}
            className="ml-2 list-none text-gray-200 font-bold"
          >
            <div className="course-name">{course.name}</div>
            {course.sections.map((section, index) => (
              <div key={index}>
                <div className="ml-4 font-semibold text-gray-200 dark:text-gray-200">
                  Section {section.number}:
                </div>
                {section.meetTimes.map((meetingTime) => (
                  <div
                    key={
                      meetingTime.meetDays +
                      meetingTime.meetTimeBegin +
                      meetingTime.meetTimeEnd
                    }
                    className={`ml-8 font-normal text-gray-200 dark:text-gray-200`}
                  >
                    {meetingTime.meetDays.join(", ")}: &nbsp;{" "}
                    {meetingTime.meetTimeBegin} - {meetingTime.meetTimeEnd}
                  </div>
                ))}
              </div>
            ))}
            {course.sections.length === 0 && (
              <div className={`text-gray-200 dark:text-gray-200`}>
                No sections found.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
