import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardHeader, CardMedia, CardContent } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Button } from 'material-ui';
import { SMALL } from 'material-ui/utils/withWidth';
import SimpleSnackbar from'../TinNhan/SimpleSnackbar';

const styles = theme => ({
    card: {
    },
    media: {
        height: 0,
        paddingTop: '25%', // 4:1
    },
    avatar: {
        backgroundColor: red[500],
    },
});

class BaiDang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: localStorage.getItem('role'),
            partnerName: "Not found",
            partnerAvatar: "",
            postTime: "",
            exp: "",
            title: "Not found",
            content: "<p>Bài viết bạn đang tìm kiếm hiện không có</p>",
            image: "",
            item: [],
            snackbar: ""
        }
    }
    componentDidMount() {
        return fetch('http://qltt.vn/api/post/' + this.props.match.params.id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    partnerName: responseJson.partnerName,
                    partnerAvatar: "",
                    postTime: responseJson.postTime,
                    exp: responseJson.exp,
                    title: responseJson.title,
                    content: responseJson.content,
                    image: responseJson.image
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
    follow() {
        var data = new FormData();
        data.append("postId", this.props.match.params.id);
        fetch("http://qltt.vn/api/student/" + localStorage.getItem('id') +"/follows?accessToken=" + localStorage.getItem('token'), {
              method: 'POST',
              body: data
          })
          .then(res => res.json())
          .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
         if(!("error" in this.state.items)) {
                this.setState({
                    snackbar: null
                  });
                 this.setState({
                    snackbar: <SimpleSnackbar mess={"theo dõi thành công"}/>
                  });
            } else {
                this.setState({
                    snackbar: null
                  });
                 this.setState({
                    snackbar: <SimpleSnackbar mess={"theo dõi thất bại"}/>
                  });
            }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.media}
                        image={this.state.image}
                        title="Ảnh bìa của bài viết"
                    />
                    <CardHeader
                        avatar={
                            <Avatar className={classes.avatar} src={this.state.partnerAvatar}>
                                {this.state.partnerAvatar === "" ? this.state.partnerName.substring(0, 1) : ""}
                            </Avatar>
                        }
                        action={
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Button size={SMALL} disabled style={{ minWidth: '0', padding: 0, marginRight: '5px' }}>{this.state.exp}</Button>
                                {
                                    (this.state.role != 0) ? (
                                        <IconButton onClick={this.handleFollowClick}>
                                            <MoreVertIcon color="primary" />
                                        </IconButton>
                                    ) : (
                                            <Button variant="raised" color="primary" onClick = {() => {this.follow()}}>Theo dõi</Button>
                                        )
                                }

                            </div>
                        }
                        title={<Typography variant="title">{this.state.title}</Typography>}
                    />
                    <CardContent>
                        <Typography variant="subheading">
                            <div dangerouslySetInnerHTML={{__html: this.state.content}} />
                        </Typography>
                    </CardContent>
                </Card>
                {this.state.snackbar}
            </div>
        );
    }
}

BaiDang.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BaiDang);
