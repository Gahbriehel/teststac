"use client";

// app/merchants/dashboard/page.tsx
import { type NextPage } from "next";
import { useState } from "react";
import { motion } from "framer-motion";
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
import {
  TbSquareRoundedChevronLeftFilled,
  TbSquareRoundedChevronRightFilled,
  TbSquareRoundedChevronsLeftFilled,
  TbSquareRoundedChevronsRightFilled,
} from "react-icons/tb";
import { GoInbox } from "react-icons/go";
import { MdError, MdPerson } from "react-icons/md";
import { v4 } from "uuid";
import { clsx } from "clsx";
import { GrClose } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { Sidebar } from "@/components/UI/Sidebar";
import Image from "next/image";
import { Button } from "@headlessui/react";
import { PiLightningBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Modal } from "@/components/UI/Modal";
import { StatContainer } from "@/components/UI/StatContainer";

// Dummy data embedded
const dummyUser = {
  firstName: "Adebowale",
  lastName: "Paul-George",
  image: "/avatar.jpg",
  message: "Welcome back to Bokku HQ",
};

const time = "Afternoon";
const greeting = {
  main: `How’s your ${time} going, ${dummyUser.firstName}?`,
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
      ], // Dummy values
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      tension: 0.1,
    },
  ],
};

const dummyLocations = [
  {
    id: "1",
    locationName: "Bokul Lekki",
    region: "Bokul Region 1",
    manager: "Cynthia Ofri",
    openingBalance: "₦570,000",
    remainingBalance: "₦570,000",
    amountMopped: "₦8,000,000",
    feeStatus: "Daily Fee",
  },
  {
    id: "2",
    locationName: "Bokul Egbeda",
    region: "Bokul Region 2",
    manager: "Adetola Makinde",
    openingBalance: "₦3,000,000",
    remainingBalance: "₦1,000,000",
    amountMopped: "₦2,800,000",
    feeStatus: "Weekend Fee",
  },
  // Add more dummy rows as needed, up to 78, but for demo, 2 is fine
  {
    id: "3",
    locationName: "Bokul Ikeja",
    region: "Bokul Region 3",
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
  placeholder,
  searchQuery,
  setSearchQuery,
  ...paginationControls
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="sticky -top-6 z-10 mb-6 flex flex-col bg-white shadow-sm md:flex-row md:items-center md:justify-between md:gap-4">
        {children}
        {setSearchQuery && (
          <div className="relative w-full md:max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IoSearch size={18} />
            </div>
            <input
              type="text"
              placeholder={placeholder ?? "Search name"}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm font-normal text-gray-700 transition-colors focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 sm:h-12"
            />
            {searchQuery && (
              <GrClose
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearchQuery("");
                }}
              />
            )}
          </div>
        )}
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
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table role="table" className="w-full border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={v4()}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={v4()}
                      className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-sky-600"
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
                        "whitespace-nowrap px-4 py-3.5 text-sm font-normal text-gray-600",
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
                      className="whitespace-nowrap bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase text-gray-700"
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
      {paginationControls.nextPage && paginationControls.previousPage && (
        <PaginationControls {...paginationControls} />
      )}
    </motion.div>
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

function PaginationControls({
  gotoPage = () => {},
  previousPage = () => {},
  nextPage = () => {},
  setPageSize = () => {},
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  canPreviousPage = false,
  canNextPage = false,
}: Partial<IPaginationControls>): JSX.Element {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
      <div className="flex items-center text-sm text-gray-600">
        <span>
          Showing page {currentPage} of {totalPages}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            gotoPage(1);
          }}
          disabled={!canPreviousPage}
          className="rounded p-1 text-sky-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          aria-label="First page"
        >
          <TbSquareRoundedChevronsLeftFilled className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={previousPage}
          disabled={!canPreviousPage}
          className="rounded p-1 text-sky-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <TbSquareRoundedChevronLeftFilled className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={nextPage}
          disabled={!canNextPage}
          className="rounded p-1 text-sky-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <TbSquareRoundedChevronRightFilled className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => {
            gotoPage(totalPages);
          }}
          disabled={!canNextPage}
          className="rounded p-1 text-sky-600 hover:bg-sky-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          aria-label="Last page"
        >
          <TbSquareRoundedChevronsRightFilled className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="go-to-page" className="text-sm text-gray-600">
            Go to:
          </label>
          <input
            id="go-to-page"
            type="number"
            defaultValue=""
            min={1}
            max={totalPages}
            onChange={(e) => {
              const page = +e.target.value;
              if (page < 1 && page > totalPages) return;
              gotoPage(page || 1);
            }}
            disabled={!canNextPage && !canPreviousPage}
            className="w-14 rounded border border-gray-200 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="rows-per-page" className="text-sm text-gray-600">
            Rows per page:
          </label>
          <select
            id="rows-per-page"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="rounded border border-gray-200 px-2 py-1 text-sm"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Mock chart component (using simple SVG for line chart, or integrate Recharts if available)
function CashPickupChart() {
  return (
    <div className="h-64 w-full bg-gray-50 rounded-lg flex items-center justify-center">
      <canvas width={800} height={200} className="w-full h-full">
        {/* Simple dummy line chart rendering */}
        <line x1="0" y1="100" x2="800" y2="100" stroke="blue" strokeWidth="2" />
        {/* Add more lines/points based on dummyChartData */}
      </canvas>
    </div>
  );
}

const DashboardPage: NextPage = () => {
  const [rowSelection, setRowSelection] = useState({});
  const [modalDisplay, setModalDisplay] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 w-full text-black">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <header className="bg-white shadow-sm border-b w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-gray-200 gap-4 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Image
                src={dummyUser.image}
                alt={dummyUser.firstName}
                width={48}
                height={48}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg sm:text-xl font-semibold truncate">
                  {dummyUser.firstName + " " + dummyUser.lastName}
                </p>
                <p className="text-sm font-medium text-[#000000B2] truncate">
                  {dummyUser.message}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-end sm:justify-start">
              <Button
                className="bg-[#242440] text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-xl hover:bg-[#212157] cursor-pointer flex items-center gap-2 flex-1 sm:flex-none justify-center sm:justify-start"
                onClick={() => setModalDisplay(true)}
              >
                <PiLightningBold className="flex-shrink-0" /> Escalate an Issue
              </Button>
              <IoMdNotificationsOutline className="text-2xl sm:text-3xl cursor-pointer flex-shrink-0" />
            </div>
          </header>

          <main className="p-4 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {greeting.main}
              </h1>
              <p className="text-[#52525B] text-sm sm:text-base">
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

            {/* Chart */}
            <div className="flex">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    Total Cash Pickup (Across Stores)
                  </h3>
                  <select className="text-sm border border-gray-200 rounded w-full sm:w-auto">
                    <option>12 Months</option>
                    <option>4 Months</option>
                    <option>30 Days</option>
                    <option>7 Days</option>
                  </select>
                </div>
                <CashPickupChart />
                <button className="mt-4 text-sm text-sky-600">
                  Export Report
                </button>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                  <button className="w-full text-left">
                    <span className="block text-sm text-gray-500 mb-2">
                      Create a new location
                    </span>
                    <span className="text-sky-600 font-medium">
                      Create Location
                    </span>
                  </button>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                  <button className="w-full text-left">
                    <span className="block text-sm text-gray-500 mb-2">
                      Create a new Manager
                    </span>
                    <span className="text-sky-600 font-medium">
                      Create Manager
                    </span>
                  </button>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                  <button className="w-full text-left">
                    <span className="block text-sm text-gray-500 mb-2">
                      Create a new Region
                    </span>
                    <span className="text-sky-600 font-medium">
                      Create Region
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="grid grid-cols-1  gap-6 sm:gap-8">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                  Today’s Trending Locations
                </h3>
                <Table<LocationData>
                  data={dummyLocations}
                  columns={columns as ColumnDef<LocationData>[]}
                  onRowClick={(row) => console.log(row)}
                  error={false}
                  loading={false}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Modal
        display={modalDisplay}
        close={() => setModalDisplay(false)}
        title={<MdPerson />}
      >
        <div className="text-[#242440]">
          <h3 className="text-2xl font-semibold">
            Candice Ademide is your Account Manager
          </h3>
          <p className="text-sm text-[#656565]">
            The fastest way to have issues resolved is to reach out to your
            account manager ASAP. Find your account manager’s details below
          </p>
          <div className="flex justify-start my-4 gap-4 items-center">
            <Image
              src="/candice.png"
              alt="candice"
              width={40}
              height={40}
              className="rounded-full bg-[#A2A8CD] w-[50px]"
            />
            <div>
              <h3 className="text-md text-[#344054] font-semibold">
                Candice Ademide
              </h3>
              <p className="text-sm text-[#475467]">
                candice.ademide@getstac.com
              </p>
              <p className="text-sm text-[#475467]">+2349087254489 </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="bg-[#242440] text-white font-semibold py-2 cursor-pointer rounded-md hover:bg-indigo-900 w-full"
              onClick={() => setModalDisplay(false)}
            >
              Send an email
            </Button>
            <Button
              className="bg-white text-[#344054] border border-gray-400 font-semibold py-2 cursor-pointer rounded-md hover:bg-indigo-100 w-full"
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
