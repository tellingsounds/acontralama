/**
 * Timecode validation, to be used in multiple locations.
 */
import * as Yup from 'yup';

import { secondsToString } from './util';

const regionsOverlap: (r1: [number, number], r2: [number, number]) => boolean =
  ([s1, e1], [s2, e2]) =>
    (e2 >= s1 && e2 <= e1) || (s2 >= s1 && s2 <= e1) || (s2 <= s1 && e2 >= e1);

const checkIfWithinOneParent: (
  layer: [number, number],
  parentTimecodes: [number, number][],
) => boolean = ([sL, eL], parentTimecodes) => {
  let withinParent = false;
  parentTimecodes.forEach(([sP, eP]) => {
    if (sL >= sP && eL <= eP) {
      withinParent = true;
    }
  });
  return withinParent;
};

export const makeTimecodesValidation = (
  minCount: number, // Minimum number of timecodes
  clipDuration: number, // startParent - endParent
) =>
  Yup.array()
    .min(minCount)
    .of(
      Yup.array()
        .length(2)
        .of(Yup.number())
        .test(
          'startLtEnd',
          'End needs to be greater than start',
          function (vals) {
            const [start, end] = vals as [number, number];
            return end > start;
          },
        )
        .test(
          'withinClipBoundaries',
          `Region needs to be within parent element duration (${secondsToString(
            clipDuration,
          )})`,
          function (vals) {
            const [start, end] = vals as [number, number];
            return start >= 0 && end <= clipDuration;
          },
        ),
    )
    .test('nonOverlapping', 'Regions must not overlap', function (vals) {
      const overlapping: Set<number> = new Set();
      ((vals || []) as Array<[number, number]>).forEach(function (
        [start, end],
        index,
      ) {
        ((vals || []) as Array<[number, number]>).forEach(function (
          [otherStart, otherEnd],
          otherIndex,
        ) {
          if (
            index !== otherIndex &&
            start < end &&
            otherStart < otherEnd &&
            regionsOverlap([start, end], [otherStart, otherEnd])
          ) {
            overlapping.add(index);
            overlapping.add(otherIndex);
          }
        });
      });
      const errors = Array.from(overlapping).map(index =>
        this.createError({
          path: `${this.path}.${index}`,
          message: 'Regions must not overlap',
        }),
      );
      if (errors.length > 0) {
        throw new Yup.ValidationError(errors);
      }
      return true;
    });

export const makeLayersTimecodesValidation = (
  minCount: number, // Minimum number of timecodes
  parentTimecodes: [number, number][],
) =>
  Yup.array()
    .min(minCount)
    .of(
      Yup.array()
        .length(2)
        .of(Yup.number())
        .test(
          'startLtEnd',
          'End needs to be greater than start.',
          function (vals) {
            const [start, end] = vals as [number, number];
            return end > start;
          },
        ),
    )
    .test('nonOverlapping', 'Regions must not overlap.', function (vals) {
      const overlapping: Set<number> = new Set();
      ((vals || []) as Array<[number, number]>).forEach(function (
        [start, end],
        index,
      ) {
        ((vals || []) as Array<[number, number]>).forEach(function (
          [otherStart, otherEnd],
          otherIndex,
        ) {
          if (
            index !== otherIndex &&
            start < end &&
            otherStart < otherEnd &&
            regionsOverlap([start, end], [otherStart, otherEnd])
          ) {
            overlapping.add(index);
            overlapping.add(otherIndex);
          }
        });
      });
      const errors = Array.from(overlapping).map(index =>
        this.createError({
          path: `${this.path}.${index}`,
          message: 'Regions must not overlap',
        }),
      );
      if (errors.length > 0) {
        throw new Yup.ValidationError(errors);
      }
      return true;
    })
    .test(
      'withinOneParentBoundary',
      'Regions must be within one parent element duration.',
      function (vals) {
        const withinParent: Set<number> = new Set();
        ((vals || []) as Array<[number, number]>).forEach(function (
          [start, end],
          index,
        ) {
          if (!checkIfWithinOneParent([start, end], parentTimecodes)) {
            withinParent.add(index);
          }
        });
        const errors = Array.from(withinParent).map(index =>
          this.createError({
            path: `${this.path}.${index}`,
            message: 'Must be within one parent element duration.',
          }),
        );
        if (errors.length > 0) {
          throw new Yup.ValidationError(errors);
        }
        return true;
      },
    );
