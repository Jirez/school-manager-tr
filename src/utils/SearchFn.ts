import type { FilterFn, Row } from "@tanstack/react-table";
import { matchSorter } from "match-sorter";
import { removeAccents } from "./removeAccents";

export default function matchSorterFilterFn(
  rows: readonly any[],
  id: any,
  filterValue: string
) {
  // return matchSorter(rows, filterValue.trim(), {threshold: matchSorter.rankings.MATCHES, keys: [(item: any) => id.map((key: any) => item.original[key])] });
  // console.log(rows)
  const words = filterValue.split("");
  return words.reduceRight(
    (items, word) =>
      matchSorter(items, word, {
        // keys: [(row: any) => row.values[id]],
        keys: [(item: any) => id.map((key: any) => item.values[key])],
        // threshold: matchSorter.rankings.MATCHES,
      }),
    rows
  );
}

export const customFilterFn = (
  rows: readonly any[],
  ids: string[],
  filterValue?: string
) => {
  if (!filterValue || filterValue.trim() === "") {
    return rows;
  }

  const value = filterValue.trim();
  const words = value
    .split(" ")
    .filter((w) => w !== "")
    .map((w) => w.toLowerCase());

  /* return rows
        .map((row) => row.values)
        .filter((original) => {
        //console.log(original['lastName'])
        return original['lastName'].indexOf(value) !== -1
    })*/
  return rows.filter((row) => {
    // const rowValue = row.values['lastName']
    const rowValue: string = ids
      .map((id) => row.values[id])
      .join(" ")
      .toLowerCase();

    return rowValue !== undefined
      ? /* String(rowValue)
                .toLowerCase()
                .includes(String(value).toLowerCase())*/
        // words.some((value, index, array) => rowValue.includes(value))
        words.map((w) => rowValue.includes(w)).reduce((a, b) => a && b)
      : // _.intersectionWith(words, rowValue, _.includes).length > 0
        true;
  });
};

// filter functions
export const matchWord: FilterFn<any> = (row, columnId, value: string) => {
  // const search = filterValue.toLowerCase()
  // return row.getValue(columnId)?.toLowerCase().includes(search)
  const words: string[] = removeAccents(value)
    .split(" ")
    .filter((w: string) => w !== "")
    .map((w: string) => w.toLowerCase());

  return words
    .map((w) => {
      const rowValue = row.getValue(columnId);
      // console.log(typeof rowValue, columnId, rowValue)

      if (typeof rowValue === "string") {
        return removeAccents(rowValue)?.toLowerCase().includes(w);
      }

      if (typeof rowValue === "number") {
        return rowValue === Number(w);
      }

      return false;
    })
    .reduce((a, b) => a && b);
};

matchWord.autoRemove = (val: any) => testFalsey(val);

function testFalsey(val: any) {
  return val === undefined || val === null || val === "";
}

export const inArrayFilterFn: FilterFn<any> = (
  row: Row<any>,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void
) => {
  const rowValue = row.getValue(columnId);
  // return true if rowValue is in filterValue
  return filterValue.includes(rowValue);
};

export const matchSentence = (candidate: any, input: string): boolean => {
  if (candidate.label === "Ajouter" || !input) {
    return true;
  }

  const value = input.trim();
  const words: string[] = removeAccents(value)
    .split(" ")
    .filter((w: string) => w !== "")
    .map((w: string) => w.toLowerCase());

  const rowValue = candidate.label;

  return words
    .map((w) => {
      if (typeof rowValue === "string") {
        return removeAccents(rowValue)?.toLowerCase().includes(w);
      }

      if (typeof rowValue === "number") {
        return rowValue === Number(w);
      }

      return false;
    })
    .reduce((a, b) => a && b);
};
