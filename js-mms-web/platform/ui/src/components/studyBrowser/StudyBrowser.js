import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Thumbnail } from './Thumbnail.js';
import './StudyBrowser.styl';
import classNames from 'classnames';

function StudyBrowser(props) {
  const {
    studies,
    onThumbnailClick,
    onThumbnailDoubleClick,
    supportsDrag,
    showThumbnailProgressBar,
  } = props;

  const tabList = [
    { key: 'current', label: '当前访视' },
    { key: 'past', label: '既往访视' },
  ];

  const [currentKey, setCurrentKey] = useState('current');

  const switchTab = key => {
    setCurrentKey(key);
  };

  return (
    <div className="study-browser">
      <div className="study-menu">
        {tabList.map(item => (
          <div
            className={classNames('study-item', {
              active: currentKey === item.key,
            })}
            key={item.key}
            onClick={() => switchTab(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="scrollable-study-thumbnails">
        {studies
          .map((study, studyIndex) => {
            const { StudyInstanceUID } = study;
            return study.thumbnails.map((thumb, thumbIndex) => {
              // TODO: Thumb has more props than we care about?
              const {
                active,
                altImageText,
                displaySetInstanceUID,
                imageId,
                derivedDisplaySetsNumber,
                numImageFrames,
                SeriesDescription,
                SeriesNumber,
                hasWarnings,
                hasDerivedDisplaySets,
              } = thumb;

              return (
                <div
                  key={thumb.displaySetInstanceUID}
                  className="thumbnail-container"
                  data-cy="thumbnail-list"
                >
                  <Thumbnail
                    active={active}
                    supportsDrag={supportsDrag}
                    key={`${studyIndex}_${thumbIndex}`}
                    id={`${studyIndex}_${thumbIndex}`} // Unused?
                    // Study
                    StudyInstanceUID={StudyInstanceUID} // used by drop
                    // Thumb
                    altImageText={altImageText}
                    imageId={imageId}
                    derivedDisplaySetsNumber={derivedDisplaySetsNumber}
                    displaySetInstanceUID={displaySetInstanceUID} // used by drop
                    numImageFrames={numImageFrames}
                    SeriesDescription={SeriesDescription}
                    SeriesNumber={SeriesNumber}
                    hasWarnings={hasWarnings}
                    hasDerivedDisplaySets={hasDerivedDisplaySets}
                    // Events
                    onClick={onThumbnailClick.bind(
                      undefined,
                      displaySetInstanceUID
                    )}
                    onDoubleClick={onThumbnailDoubleClick}
                    showProgressBar={showThumbnailProgressBar}
                  />
                </div>
              );
            });
          })
          .flat()}
      </div>
    </div>
  );
}

const noop = () => {};

StudyBrowser.propTypes = {
  studies: PropTypes.arrayOf(
    PropTypes.shape({
      StudyInstanceUID: PropTypes.string.isRequired,
      thumbnails: PropTypes.arrayOf(
        PropTypes.shape({
          altImageText: PropTypes.string,
          displaySetInstanceUID: PropTypes.string.isRequired,
          imageId: PropTypes.string,
          derivedDisplaySetsNumber: PropTypes.number,
          numImageFrames: PropTypes.number,
          SeriesDescription: PropTypes.string,
          SeriesNumber: PropTypes.number,
          stackPercentComplete: PropTypes.number,
        })
      ),
    })
  ).isRequired,
  supportsDrag: PropTypes.bool,
  onThumbnailClick: PropTypes.func,
  onThumbnailDoubleClick: PropTypes.func,
  showThumbnailProgressBar: PropTypes.bool,
};

StudyBrowser.defaultProps = {
  studies: [],
  supportsDrag: true,
  onThumbnailClick: noop,
  onThumbnailDoubleClick: noop,
  showThumbnailProgressBar: true,
};

export { StudyBrowser };
