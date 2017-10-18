import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaReactions, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  EpisodesBox,
  RelatedMediaBox,
  ReactionsBox,
  CharactersBox,
} from 'kitsu/screens/Profiles/components';

import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';

class Summary extends Component {
  static propTypes = {
    castings: PropTypes.array.isRequired,
    media: PropTypes.object.isRequired,
    reactions: PropTypes.array.isRequired,

    fetchMediaReactions: PropTypes.func.isRequired,
    fetchMediaCastings: PropTypes.func.isRequired,
    fetchMedia: PropTypes.func.isRequired,
    setActiveTab: PropTypes.func.isRequired,
  }

  static defaultProps = {
    media: {},
  }

  componentDidMount() {
    const mediaId = 12;
    const type = 'anime';
    this.props.fetchMediaReactions(mediaId, type);
    this.props.fetchMediaCastings(mediaId);
    this.props.fetchMedia(mediaId, type);
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  formatData(data, numberOfItems = 12) {
    if (!data) return [];

    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  render() {
    const { media, castings, reactions } = this.props;
    const series = media.type === 'anime' ? media.episodes || [] : media.chapters || [];
    const seriesCount = series.length;

    return (
      <SceneContainer>
        <EpisodesBox
          title={`Episodes・${seriesCount}`}
          data={this.formatData(series)}
          placeholderImage={media.posterImage && media.posterImage.large}
          onViewAllPress={() => this.navigateTo('Episodes')}
        />
        <RelatedMediaBox
          contentDark
          title="More from this series"
          data={this.formatData(media.mediaRelationships)}
        />
        <ReactionsBox
          title="Reactions"
          titleAction={() => {}}
          titleLabel="Write reactions"
          reactedMedia={media.canonicalTitle}
          data={this.formatData(reactions)}
          onViewAllPress={() => this.navigateTo('Reactions')}
        />
        <CharactersBox
          contentDark
          title="Characters"
          data={this.formatData(castings)}
          onViewAllPress={() => this.navigateTo('Characters')}
        />
      </SceneContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { media, reactions, castings } = state.media;

  const mediaId = 12;

  return {
    media: media[mediaId],
    reactions: reactions[mediaId] || [],
    castings: castings[mediaId] || [],
  };
};

export default connect(mapStateToProps, {
  fetchMedia,
  fetchMediaReactions,
  fetchMediaCastings,
})(Summary);
