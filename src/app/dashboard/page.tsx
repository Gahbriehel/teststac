"use client";

import { type NextPage } from "next";
import { useState } from "react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  useRef,
  useEffect,
  type ReactNode,
  type HTMLProps,
  type Dispatch,
  type SetStateAction,
  type JSX,
} from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { GoInbox } from "react-icons/go";
import { MdError, MdPerson } from "react-icons/md";
import { v4 } from "uuid";
import { clsx } from "clsx";
import { Sidebar } from "@/components/UI/Sidebar";
import Image from "next/image";
import { Button } from "@headlessui/react";
import { PiLightningBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Modal } from "@/components/UI/Modal";
import { StatContainer } from "@/components/UI/StatContainer";
import Link from "next/link";
import { TbCircleDotted } from "react-icons/tb";
import { IoDocumentOutline } from "react-icons/io5";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const dummyUser = {
  firstName: "Adebowale",
  lastName: "Paul-George",
  image: "/avatar.jpg",
  message: "Welcome back to Bokku HQ",
};

const time = "Afternoon";
const greeting = {
  main: `How's your ${time} going, ${dummyUser.firstName}?`,
  message: `How are you feeling this fine ${time}?`,
};

const stats = {
  balanceAcrossStores: "₦50,000,000",
  todaysTransactions: 200,
  totalLocations: 78,
  totalManagers: 78,
};

const dummyChartData = {
  labels: [
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
  ],
  datasets: [
    {
      label: "Total Cash Pickup",
      data: [
        0, 1200000, 1900000, 3000000, 5000000, 2000000, 3000000, 6000000,
        4000000, 5000000, 7000000, 5062,
      ],
      borderColor: "#242440",
      backgroundColor: "#fff",
      tension: 0.1,
      fill: false,
      pointBackgroundColor: "#242440",
      pointBorderColor: "#fff",
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Secondary Line",
      data: [
        500000, 1500000, 2200000, 2800000, 4500000, 1800000, 2800000, 5500000,
        3500000, 4800000, 6500000, 4500,
      ],
      borderColor: "#33619B",
      backgroundColor: "#e4dfdfff",
      tension: 0.1,
      fill: true,
      pointBackgroundColor: "#fff",
      pointBorderColor: "#2c5a92ff",
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ],
};

const dummyLocations = [
  {
    id: "1",
    locationName: "Bokku Lekki",
    region: "Bokku - Region 1",
    manager: "Cynthia Ofori",
    openingBalance: "₦570,000",
    remainingBalance: "₦570,000",
    amountMopped: "₦8,000,000",
    feeStatus: "Daily Fee",
  },
  {
    id: "2",
    locationName: "Bokku Egbeda",
    region: "Bokku - Region 2",
    manager: "Adetola Makinde",
    openingBalance: "₦3,000,000",
    remainingBalance: "₦1,000,000",
    amountMopped: "₦2,800,000",
    feeStatus: "Weekend Fee",
  },
  {
    id: "3",
    locationName: "Bokku Ikeja",
    region: "Bokku - Region 3",
    manager: "John Doe",
    openingBalance: "₦1,200,000",
    remainingBalance: "₦800,000",
    amountMopped: "₦4,500,000",
    feeStatus: "Daily Fee",
  },
];

interface LocationData {
  id: string;
  locationName: string;
  region: string;
  manager: string;
  openingBalance: string;
  remainingBalance: string;
  amountMopped: string;
  feeStatus: string;
}

const columnHelper = createColumnHelper<LocationData>();

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
  }),
  columnHelper.accessor("locationName", {
    header: "Location Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("region", {
    header: "Region",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("manager", {
    header: "Manager",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("openingBalance", {
    header: "Opening Balance",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("remainingBalance", {
    header: "Remaining Balance",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amountMopped", {
    header: "Amount Mopped",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("feeStatus", {
    header: "Fee Status",
    cell: (info) => info.getValue(),
  }),
];

/* eslint-disable @typescript-eslint/no-explicit-any */
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

interface Props<T> extends Partial<IPaginationControls & ISearchQuery> {
  data: T[];
  columns: Array<ColumnDef<T>>;
  children?: ReactNode;
  onRowClick?: (rowData: T) => void;
  error: boolean;
  loading?: boolean;
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
}

interface IPaginationControls {
  gotoPage: (pageIndex: number) => void;
  previousPage: () => void;
  nextPage: () => void;
  setPageSize: (pageSize: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

interface ISearchQuery {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (value: SetStateAction<string>) => void;
}

function Table<T>({
  data,
  columns,
  children,
  onRowClick = () => {},
  error,
  loading,
  rowSelection,
  setRowSelection,
}: Props<T>): JSX.Element {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  return (
    <div>
      <div className="sticky z-10 mb-6 flex flex-col bg-white shadow-sm md:flex-row md:items-center md:justify-between md:gap-4">
        {children}
      </div>
      {loading && <div className="py-8">Loading...</div>}
      {data.length === 0 && !error && !loading && (
        <div className="flex h-60 w-full flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 text-gray-500">
          <GoInbox className="text-4xl" />
          <span className="text-sm font-medium">No data available</span>
        </div>
      )}
      {error && (
        <div className="flex h-60 w-full flex-col items-center justify-center gap-2 rounded-lg bg-red-50 text-red-500">
          <MdError className="text-4xl" />
          <span className="text-sm font-medium">
            An error occurred while loading data
          </span>
        </div>
      )}
      {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-100 -mx-4 sm:mx-0">
          <table role="table" className="w-full border-collapse min-w-[800px]">
            <thead className="bg-[#242440] text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={v4()}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={v4()}
                      className="whitespace-nowrap border-b border-gray-200 px-3 sm:px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={v4()}
                  onClick={() => {
                    onRowClick(row.original);
                  }}
                  className={clsx("transition-colors hover:bg-sky-50/60")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={v4()}
                      className={clsx(
                        "whitespace-nowrap px-3 sm:px-4 py-3.5 text-xs sm:text-sm font-normal text-gray-600",
                        !["email"].includes(cell.column.id) && "capitalize",
                      )}
                    >
                      {!["select", "image"].includes(cell.column.id) &&
                      (cell.getValue() === null ||
                        cell.getValue() === undefined ||
                        cell.getValue() === "") ? (
                        <span className="text-gray-400">N/A</span>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr
                  key={v4()}
                  className={clsx({
                    "border-t": footerGroup.headers.some(
                      ({ column }) => column.columnDef.footer,
                    ),
                  })}
                >
                  {footerGroup.headers.map((footer) => (
                    <th
                      key={v4()}
                      className="whitespace-nowrap bg-gray-50 px-3 sm:px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
                    >
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={
        className +
        " h-4 w-4 cursor-pointer rounded border-gray-300 text-sky-500 focus:ring-sky-400"
      }
      {...rest}
    />
  );
}

function CashPickupChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `₦${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
      y: {
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          display: false,
          callback: function (this: any, tickValue: string | number) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `₦${(value / 1000000000).toFixed(0)}BN`;
          },
          color: "#6B7280",
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        pointStyle: "circle",
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    animation: {
      duration: 1000,
    },
  };

  return (
    <div className="relative h-48 sm:h-64 w-full">
      <Line data={dummyChartData} options={options} />
    </div>
  );
}

const DashboardPage: NextPage = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [modalDisplay, setModalDisplay] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("12 Months");

  const periodOptions = ["12 Months", "6 Months", "30 Days", "7 Days"];

  return (
    <div className="min-h-screen bg-gray-50 w-full text-black">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <header className="bg-white shadow-sm border-b w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 lg:p-6 border-gray-200 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
              <Image
                src={dummyUser.image}
                alt={dummyUser.firstName}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-base sm:text-lg lg:text-xl font-semibold truncate">
                  {dummyUser.firstName + " " + dummyUser.lastName}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#000000B2] truncate">
                  {dummyUser.message}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 w-full sm:w-auto justify-end sm:justify-start">
              <Button
                className="bg-[#242440] text-white px-3 py-2 lg:px-4 lg:py-3 text-xs sm:text-sm lg:text-base rounded-xl hover:bg-[#212157] cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center sm:justify-start whitespace-nowrap"
                onClick={() => setModalDisplay(true)}
              >
                <PiLightningBold className="flex-shrink-0" />
                <span className="hidden sm:inline">Escalate an Issue</span>
                <span className="sm:hidden">Escalate</span>
              </Button>
              <IoMdNotificationsOutline className="text-xl sm:text-2xl lg:text-3xl cursor-pointer flex-shrink-0" />
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {greeting.main}
              </h1>
              <p className="text-[#52525B] text-xs sm:text-sm lg:text-base">
                {greeting.message}
              </p>
            </div>

            <StatContainer
              data={[
                {
                  title: "Balance across stores",
                  value: stats.balanceAcrossStores,
                },
                {
                  title: "Today's transactions",
                  value: stats.todaysTransactions.toString(),
                },
                {
                  title: "Total locations",
                  value: stats.totalLocations.toString(),
                },
                {
                  title: "Total managers",
                  value: stats.totalManagers.toString(),
                },
              ]}
            />

            {/* Chart and Quick Actions */}
            <div className="flex flex-col lg:flex-row gap-4 mt-6">
              <div className="bg-white p-4 sm:p-5 lg:p-6 w-full lg:w-[70%] rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900">
                      Total Cash Pickup (Across Stores)
                    </h3>
                    <button className="text-xs sm:text-sm flex items-center justify-center gap-1 border px-3 py-2 border-gray-200 rounded-md cursor-pointer hover:bg-gray-100 self-start sm:self-auto">
                      <IoDocumentOutline />
                      <span>Export Report</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {periodOptions.map((period) => (
                      <Button
                        key={period}
                        className={clsx(
                          "px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs rounded-md border border-gray-300 cursor-pointer transition-colors",
                          selectedPeriod === period
                            ? "bg-gray-100 text-black font-medium"
                            : "bg-white text-gray-600 hover:bg-gray-50",
                        )}
                        onClick={() => setSelectedPeriod(period)}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
                <CashPickupChart />
              </div>

              <div className="flex flex-col p-4 sm:p-5 lg:p-6 gap-4 bg-white w-full lg:w-[30%] rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-sm sm:text-base font-medium text-gray-900">
                  Quick Actions
                </h2>
                <Link
                  href="#"
                  className="bg-white p-3 sm:p-3.5 rounded-lg shadow-sm border border-dashed border-[#242440] flex items-center gap-2.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                >
                  <TbCircleDotted className="text-base sm:text-lg flex-shrink-0" />
                  <span>Create a new location</span>
                </Link>
                <Link
                  href="#"
                  className="bg-white p-3 sm:p-3.5 rounded-lg shadow-sm border border-dashed border-[#242440] flex items-center gap-2.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                >
                  <TbCircleDotted className="text-base sm:text-lg flex-shrink-0" />
                  <span>Create a new Manager</span>
                </Link>
                <Link
                  href="#"
                  className="bg-white p-3 sm:p-3.5 rounded-lg shadow-sm border border-dashed border-[#242440] flex items-center gap-2.5 text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                >
                  <TbCircleDotted className="text-base sm:text-lg flex-shrink-0" />
                  <span>Create a new Region</span>
                </Link>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 py-4 mt-6">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#242440]">
                Today’s Trending Locations
              </h3>
              <Link
                href="#"
                className="underline text-[#242440] text-xs sm:text-sm self-start sm:self-auto"
              >
                Monitor Location Activities
              </Link>
            </div>

            <Table<LocationData>
              data={dummyLocations}
              columns={columns as ColumnDef<LocationData>[]}
              onRowClick={(row) => console.log(row)}
              error={false}
              loading={false}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </main>
        </div>
      </div>

      <Modal
        display={modalDisplay}
        close={() => setModalDisplay(false)}
        title={<MdPerson />}
      >
        <div className="text-[#242440] p-2">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">
            Candice Ademide is your Account Manager
          </h3>
          <p className="text-xs sm:text-sm text-[#656565] mb-4">
            The fastest way to have issues resolved is to reach out to your
            account manager ASAP. Find your account manager’s details below
          </p>
          <div className="flex justify-start my-4 gap-3 sm:gap-4 items-center">
            <Image
              src="/candice.png"
              alt="candice"
              width={50}
              height={50}
              className="rounded-full bg-[#A2A8CD] w-12 h-12 sm:w-[50px] sm:h-[50px] flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base text-[#344054] font-semibold truncate">
                Candice Ademide
              </h3>
              <p className="text-xs sm:text-sm text-[#475467] truncate">
                candice.ademide@getstac.com
              </p>
              <p className="text-xs sm:text-sm text-[#475467]">
                +2349087254489
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:gap-3">
            <Button
              className="bg-[#242440] text-white font-semibold py-2.5 sm:py-3 text-sm cursor-pointer rounded-md hover:bg-indigo-900 w-full transition-colors"
              onClick={() => setModalDisplay(false)}
            >
              Send an email
            </Button>
            <Button
              className="bg-white text-[#344054] border border-gray-400 font-semibold py-2.5 sm:py-3 text-sm cursor-pointer rounded-md hover:bg-gray-100 w-full transition-colors"
              onClick={() => setModalDisplay(false)}
            >
              Send a message on Whatsapp
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;