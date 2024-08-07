/**
 * Templates for QueryBuilder
 */
export {};
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createStyles, makeStyles } from '@material-ui/core';

// import { EntityQueryBuilderRepr } from './EntityQueryBuilderRepr';

// import { getQbTemplates } from '../selectors/query';
// import { doLoadQbTemplate } from '../actionCreators/query';

// import { EmptyObject } from '../types';

// const useStyles = makeStyles(_theme =>
//   createStyles({
//     root: {},
//     reprs: {
//       display: 'flex',
//       flexWrap: 'wrap',
//     },
//   }),
// );

// // interface Props {
// // }

// export const EntityQueryBuilderTemplatesView: React.FC<EmptyObject> = () => {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const qbTemplates = useSelector(getQbTemplates);
//   return (
//     <div className={classes.root}>
//       <div className={classes.reprs}>
//         {qbTemplates.map(qbData => (
//           <EntityQueryBuilderRepr
//             key={qbData.id}
//             handleClick={() => dispatch(doLoadQbTemplate(qbData.id))}
//             qbData={qbData}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };
