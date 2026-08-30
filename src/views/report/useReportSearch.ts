import { useSafeState } from "ahooks";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

interface SearchOptions {
  title: string;
  orientation?: "PORTRAIT" | "LANDSCAPE";
  pageType?: "A4" | "A5" | "A3" | "A2" | "A1";
  columnBorder?: boolean;
  rowNumber?: boolean;
  tableOfContents?: boolean;
  period?: [Dayjs, Dayjs];
}

export const useSearch = (options: SearchOptions) => {
  const [params, setParams] = useState(`date:${dayjs().format("DDMMYYYY")}`);
  const [show, setShow] = useState(false);
  const [values, setValues] = useSafeState<{ [key: string]: any }>({
    search: `startDate:${dayjs().startOf("month").format("DDMMYYYY")},endDate:${dayjs().format("DDMMYYYY")}`,
    title: options.title,
    period: options.period
      ? `du ${options.period[0].format("DD/MM/YYYY")} au ${options.period[1].format("DD/MM/YYYY")}`
      : "du " + dayjs().format("DD/MM/YYYY"),
    orientation: options?.orientation ?? "PORTRAIT", // ? options.orientation : 'PORTRAIT',
    pageType: options && options.pageType ? options.pageType : "A4",
    columnBorder:
      options && options.columnBorder ? options.columnBorder : false,
    date: dayjs(),
    loading: true,
    rowNumber: options && options.rowNumber ? options.rowNumber : false,
    tableOfContents:
      options && options.tableOfContents ? options.tableOfContents : false,
  });

  const onSubmit = (values: any) => {
    buildSearch(values);
  };

  const buildSearch = (fields: any) => {
    let search = "";
    let period: string;
    const startDate = Array.isArray(fields.period)
      ? dayjs(fields.period[0])
      : dayjs(fields.period);
    const endDate = Array.isArray(fields.period)
      ? dayjs(fields.period[1])
      : dayjs(fields.period);
    if (startDate.format("DDMMYYYY") === endDate.format("DDMMYYYY")) {
      search += `startDate:${startDate.format("DDMMYYYY")},endDate:${endDate.format("DDMMYYYY")}`;
      period = "du " + startDate.format("DD/MM/YYYY");
    } else {
      search += `startDate:${startDate.format("DDMMYYYY")},endDate:${endDate.format("DDMMYYYY")}`;
      period =
        "du " +
        startDate.format("DD/MM/YYYY") +
        " au " +
        endDate.format("DD/MM/YYYY");
    }

    setValues((val) => ({ ...val, search, period, loading: true }));
  };

  useEffect(() => {
    //console.log(values);

    if (values.loading) {
      setShow(false);
      setParams(
        `date:${dayjs(values.date).format("DDMMYYYY")},title:${values.title},period:${values.period},orientation:${values.orientation},columnBorder:${values.columnBorder},rowNumber:${values.rowNumber},pageType:${values.pageType},tableOfContents:${values.tableOfContents}`,
      );
    }
  }, [values]);

  useEffect(() => {
    setShow(true);
  }, [params]);

  return {
    //handleSearch,
    onSubmit,
    values,
    setValues,
    show,
    params,
  };
};
