/**
 * Relations between entities. (Not functional atm?).
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Typography } from '@material-ui/core';

import { AutocompleteEntitiesSingle } from './AutocompleteEntities';
import { Chip } from './Chip';
import { PureSelect as Select } from './formComponents/Select';
import { SaveButton } from './formComponents/SaveButton';
import { TableView, TableViewItemProps } from './TableView';

import { getEntityById } from '../selectors/entities';
import {
  doSaveRequested,
  doSaveSuccess,
  doSaveError,
  doFetchError,
} from '../actionCreators/app';
import { getEntityRelations, saveEntityRelation } from '../services/api';

import { EntityRelationsData } from '../types/entities';

type RelationOptions = 'broader' | 'related';

interface FormProps {
  entityId: string;
  onDone: () => void;
  onUpdate: (data: EntityRelationsData) => void;
}

const AddRelationForm: React.FC<FormProps> = ({
  entityId,
  onDone,
  onUpdate,
}) => {
  const dispatch = useDispatch();
  const [relation, setRelation] = React.useState<RelationOptions | ''>('');
  const [selectedEntity, setSelectedEntity] = React.useState<string>('');
  const handleSave = () => {
    if (!relation || !selectedEntity) {
      return;
    }
    (async () => {
      dispatch(doSaveRequested());
      try {
        const newRelationsData = await saveEntityRelation({
          _id: entityId,
          relation,
          targetId: selectedEntity,
        });
        dispatch(doSaveSuccess());
        onUpdate(newRelationsData);
        onDone();
      } catch (err) {
        dispatch(doSaveError(err));
      }
    })();
  };
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Select
          required
          label="Relation"
          options={[
            { value: 'broader', label: 'broader' },
            { value: 'related', label: 'related' },
          ]}
          onChange={e => {
            setRelation(e.target.value as RelationOptions);
          }}
          value={relation}
        />
      </Grid>
      <Grid item>
        <AutocompleteEntitiesSingle
          required
          label="Entity"
          onChange={e => {
            setSelectedEntity(e.target.value);
          }}
          types={[]}
          value={selectedEntity}
        />
      </Grid>
      <Grid item>
        <SaveButton
          disabled={!relation || !selectedEntity}
          onClick={handleSave}
        />
        <Button onClick={onDone}>Cancel</Button>
      </Grid>
    </Grid>
  );
};

const makeTableEntry = (label: string, entityIds?: string[]) =>
  entityIds && entityIds.length > 0
    ? {
        label,
        contents: entityIds.map(entityId => (
          <Chip key={entityId} entityId={entityId} />
        )),
      }
    : null;

const makeRelationsTable = (relationsData: EntityRelationsData) =>
  [
    makeTableEntry('Broader', relationsData.broader),
    makeTableEntry(
      'Broader (T)',
      relationsData.broaderTransitive?.filter(
        e => !relationsData.broader.includes(e),
      ),
    ),
    makeTableEntry('Narrower', relationsData.narrower),
    makeTableEntry(
      'Narrower (T)',
      relationsData.narrowerTransitive?.filter(
        e => !relationsData.narrower.includes(e),
      ),
    ),
    makeTableEntry('Related', relationsData.related),
  ].filter(item => item !== null) as TableViewItemProps[];

interface RelationsListProps {
  entityRelationsData: EntityRelationsData;
}

const EntityRelationsList: React.FC<RelationsListProps> = ({
  entityRelationsData,
}) => (
  <div>
    {Object.keys(entityRelationsData).length > 0 ? (
      <TableView items={makeRelationsTable(entityRelationsData)} />
    ) : (
      <Typography>No relations.</Typography>
    )}
  </div>
);

interface Props {
  entityId: string;
}

export const EntityRelationsInfo: React.FC<Props> = ({ entityId }) => {
  const getE = useSelector(getEntityById);
  const [isAdding, setIsAdding] = React.useState(false);
  const [relationsData, setRelationsData] =
    React.useState<EntityRelationsData | null>(null);
  const dispatch = useDispatch();
  const entity = getE(entityId);
  React.useEffect(() => {
    (async () => {
      try {
        const fetchedRelationsData = await getEntityRelations(entityId);
        setRelationsData(fetchedRelationsData);
      } catch (err) {
        dispatch(doFetchError(err));
      }
    })();
  }, [dispatch, entityId]);
  if (!entity) {
    return <div>Error: no entity with id {entityId}</div>;
  }
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Typography>Relations</Typography>
      </Grid>
      {relationsData && (
        <Grid item>
          <EntityRelationsList entityRelationsData={relationsData} />
        </Grid>
      )}
      <Grid item>
        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)}>Add relation</Button>
        ) : (
          <AddRelationForm
            entityId={entityId}
            onDone={() => {
              setIsAdding(false);
            }}
            onUpdate={setRelationsData}
          />
        )}
      </Grid>
    </Grid>
  );
};
