/**
 * For displaying the current git revision (is used in Navbar).
 */
import React from 'react';

import { EmptyObject } from '../types';

export const GitRevision: React.FC<EmptyObject> = () => (
  <code id="LamaGitRevision" style={{ float: 'right' }}>
    Build {process.env.GIT_VERSION} {process.env.GIT_AUTHOR_DATE}
  </code>
);
