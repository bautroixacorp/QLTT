import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';
import 'moment/locale/vi'; // this is the important bit, you have to import the locale your'e trying to use.
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';

import AssignmentIcon from '@material-ui/icons/Assignment';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SimpleSnackbar from '../TinNhan/SimpleSnackbar';

moment.locale('vi');

const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['Mở đợt đăng kí thực tập', 'Kết thúc đăng kí, Bắt đầu kì thực tập', 'Kết thúc kì thực tập'];
}

class SemesterStepper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeStep: 0,
      registerStart: new Date(),
      semeStart: new Date(),
      semeEnd: new Date(),
      items: "",
      hasCurrentSeme: false,
      change: false
    };
    this.getStepContent = this.getStepContent.bind(this);
  }
  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <Grid container>
              <Grid item>
                <LockOpenIcon style={{ fontSize: '50px' }} />
              </Grid>
              <Grid item xs>
                <div>
                  <Typography variant="title"> Chọn thời điểm kết thúc (dự kiến) </Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi"> 
                    <DateTimePicker
                      disablePast
                      format="HH:mm DD/MM/YYYY"
                      value={this.state.registerStart}
                      onChange={this.handleRegisterStart}
                      showTodayButton
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div>Mở đợt đăng kí thực tập, sinh viên sẽ chọn giảng viên để nghiên cứu khoa học hoặc chọn
                  một công ty partner để đăng kí thực tập (khi đăng kí thực tập, cần chọn một giảng viên hướng dẫn)
                </div>
              </Grid>
            </Grid>
          </div>
        );
      case 1:
        return (
          <div>
            <Grid container>
              <Grid item>
                <AssignmentIcon style={{ fontSize: '50px' }} />
              </Grid>
              <Grid item xs>
              <div>
                  <Typography variant="title"> Chọn thời điểm bắt đầu học kì</Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi"> 
                    <DateTimePicker
                      format="HH:mm DD/MM/YYYY"
                      value={this.state.semeStart}
                      onChange={this.handleSemeStartChange}
                      showTodayButton
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div>Kì thực tập bắt đầu, sinh viên thường xuyên nộp báo cáo thực tập cho giảng viên hướng dẫn</div>
              </Grid>
            </Grid>
          </div>
        );
      case 2:
        return (
          <div>
            <Grid container>
              <Grid item>
                <VerifiedUserIcon style={{ fontSize: '50px' }} />
              </Grid>
              <Grid item xs>
              <div>
                  <Typography variant="title"> Chọn thời điểm kết thúc học kì</Typography>
                  <MuiPickersUtilsProvider utils={MomentUtils} moment={moment} locale="vi"> 
                    <DateTimePicker
                      format="HH:mm DD/MM/YYYY"
                      value={this.state.semeEnd}
                      onChange={this.handleSemeEndChange}
                      showTodayButton
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div>Kết thúc kì thực tập, sinh viên được xem điểm tổng kết và nhận xét từ công ty và giảng viên
                   hướng dẫn </div>
              </Grid>
            </Grid>
          </div>);
      default:
        return 'Unknown step';
    }
  }
  componentDidMount() {
    fetch("http://qltt.vn/api/admin/" + localStorage.getItem('id') +"/semester?accessToken=" + localStorage.getItem('token'))
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          items: responseJson,
        });
        this.itemToDate();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  itemToDate() {
      if(this.state.items != null) {
          this.setState({
              hasCurrentSeme: true,
              activeStep: 3,
              registerStart: new Date(this.state.items.registerStart),
              semeStart: new Date(this.state.items.startSeme),
              semeEnd: new Date(this.state.items.endSeme),
          })
      }else {
          this.setState({
              hasCurrentSeme: true,
              activeStep: 0
          })
      }
  }
  send() {
        if(this.state.change == true) {
            alert('Bạn cần tạo học kì mới!');
            return;
        }
        var data = new FormData();
        data.append("registerStart", this.state.registerStart.toISOString());
        data.append("semeStart", this.state.semeStart.toISOString());
        data.append("semeEnd", this.state.semeEnd.toISOString());
    fetch("http://qltt.vn/api/admin/" + localStorage.getItem('id') +"/semester?accessToken=" + localStorage.getItem('token'), {
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
                    snackbar: <SimpleSnackbar mess={"tạo học kì mới thành công"}/>
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
  handleSemeEndChange = (date) => {
    this.setState({ semeEnd: date });
  }
  handleSemeStartChange = (date) => {
    this.setState({ semeStart: date });
  }
  handleRegisterStart = (date) => {
    this.setState({ registerStart: date });
  }
  handleNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
  };
  handlefinalNext= () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    });
    this.send();
  };
  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      change: false
    });
  };
  handleChange = () => {
    this.setState({
      activeStep: 0,
      change: true
    });
  };

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Typography>{this.getStepContent(index)}</Typography>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                        {activeStep === steps.length - 1 ? 
                            <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handlefinalNext}
                            className={classes.button}
                            >
                            Finish</Button> : <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                            className={classes.button}
                            >
                            Next</Button>}
                      
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography>Đã kết thúc học kì, Sẵn sàng cho học kì mới?</Typography>
            <Button onClick={this.handleReset} className={classes.button}>
              Tạo học kì mới
            </Button>
            <Button onClick={this.handleChange} className={classes.button}>
              Xem lại học kì hiện tại
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

SemesterStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(SemesterStepper);