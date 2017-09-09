import React from 'react'
import { NavBar, Icon, Card, Flex } from 'antd-mobile';
import { connect } from 'react-redux';
import { topics } from '../../store/actions';
import { browserHistory } from 'react-router';
import Loading from '../../components/Loading';
import { formatime } from '../../utils';

const title = (props) => (
  <Flex direction="column" align="start" style={{width: '100%'}}>
    <span>{props.title}</span>
    <Flex justify="between" style={{width: '100%', paddingTop: '0.2rem'}}>
      <Flex style={{ fontSize: '0.28rem', color: '#888'}}>
        <span>发布于{formatime(props.create_at)}</span>
        <Flex align="center" style={{marginLeft: '.1rem'}}>
          <Icon type={require('../../icons/browse.svg')} />
          {props.visit_count}
        </Flex>
        <Flex align="center" style={{marginLeft: '.1rem'}}>
          <Icon type={require('../../icons/message.svg')} />
          {props.reply_count}
        </Flex>
      </Flex>
      { !props.accesstoken ? null :
        <div>
          {!props.is_collect && <Icon type={require('../../icons/collection.svg')} onClick={() => props.collect(props.id)} />}
          {props.is_collect && <Icon type={require('../../icons/collection_fill.svg')} onClick={() => props.decollect(props.id)} />}
        </div>
      }
    </Flex>
  </Flex>
);

class Detail extends React.Component {
  componentDidMount () {
    this.props.getDetail(this.props.params.id);
  }

  render () {
    const { loading, detail, accesstoken, collect, decollect } = this.props;
    if (loading) {
      return ( <Loading /> );
    }

    const { author } = detail;
    const loginname = author ? author.loginname : '';
    const avatar_url = author ? author.avatar_url: '';

    console.log(detail);


    return (
      <div>
        <NavBar
          leftContent={<Icon type={require('../../icons/return.svg')} />}
          mode="light"
          iconName={null}
          onLeftClick={() => browserHistory.goBack()}
        >主题详情
        </NavBar>
        <Card style={{minHeight: 'auto', marginTop: '.1rem'}}>
          <Card.Header
          thumb={avatar_url}
          title={loginname}
          extra={<span style={{fontSize: '.3rem'}}>楼主</span>}
          thumbStyle={{height: '.6rem', width: '.6rem'}}
          />
        </Card>
        <Card style={{padding: '0 0.4rem .2rem', marginTop: '.1rem'}}>
          <Card.Header 
            title={title({...detail, accesstoken, collect, decollect})}
            style={{borderBottom: '1px solid #888', marginBottom: '.2rem'}} 
          />
          <div dangerouslySetInnerHTML={{
            __html: detail.content
          }} 
          />
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getDetail: (id) => {
      dispatch(topics.getDetail(id));
    },
    collect: (topic_id) => {
      console.log('trigger');
      dispatch(topics.collect(topic_id));
    },
    decollect: (topic_id) => {
      console.log('trigger');
      dispatch(topics.decollect(topic_id));
    }
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    loading: state.status.loading,
    submitting: state.status.submitting,
    detail: state.topics.detail,
    accesstoken: state.user.accesstoken
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);