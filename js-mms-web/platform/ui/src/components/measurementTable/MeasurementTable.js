import './MeasurementTable.styl';
import './MeasurementTable.css';

import React, { Component } from 'react';
import { withTranslation } from '../../contextProviders';

import { Icon } from './../../elements/Icon';
import { MeasurementTableItem } from './MeasurementTableItem.js';
import { OverlayTrigger } from './../overlayTrigger';
import PropTypes from 'prop-types';
import { ScrollableArea } from './../../ScrollableArea/ScrollableArea.js';
import { TableList } from './../tableList';
import { Tooltip } from './../tooltip';
import { OHIFModal } from './../ohifModal';

class MeasurementTable extends Component {
  static propTypes = {
    measurementCollection: PropTypes.array.isRequired,
    timepoints: PropTypes.array.isRequired,
    overallWarnings: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    onItemClick: PropTypes.func,
    onRelabelClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onEditDescriptionClick: PropTypes.func,
    selectedMeasurementNumber: PropTypes.number,
    t: PropTypes.func,
    saveFunction: PropTypes.func,
    onSaveComplete: PropTypes.func,
  };

  static defaultProps = {
    overallWarnings: {
      warningList: [],
    },
    readOnly: false,
  };

  state = {
    selectedKey: null,
    status: 1,
    isOpen: false,
    isOpen2: false,
  };

  render() {
    const { overallWarnings, saveFunction, t, isOpen } = this.props;
    const hasOverallWarnings = overallWarnings.warningList.length > 0;

    return (
      <div className="measurementTable">
        <div className="measurementTableHeader">
          {hasOverallWarnings && (
            <OverlayTrigger
              key={'overwall-warning'}
              placement="left"
              overlay={
                <Tooltip
                  placement="left"
                  className="in tooltip-warning"
                  id="tooltip-left"
                  style={{}}
                >
                  <div className="warningTitle">
                    {t('Criteria nonconformities')}
                  </div>
                  <div className="warningContent">
                    {this.getWarningContent()}
                  </div>
                </Tooltip>
              }
            >
              <span className="warning-status">
                <span className="warning-border">
                  <Icon name="exclamation-triangle" />
                </span>
              </span>
            </OverlayTrigger>
          )}
          {this.getTimepointsHeader()}
        </div>
        <ScrollableArea>
          <div>{this.getMeasurementsGroups()}</div>
        </ScrollableArea>
        {/* <div className="measurementTableFooter">
          <div className="tabletitle margin">评估标准</div>
          <select>
            <option value="volvo">RECIST1.1</option>
            <option value="saab">mRecist</option>
          </select>
          &nbsp;&nbsp;&nbsp;
          {saveFunction && (
            <button
              onClick={this.showModal}
              className="saveBtn"
              data-cy="save-measurements-btn"
            >
              <Icon name="save" width="14px" height="14px" />
              创建报告
            </button>
          )}
        </div> */}
        <OHIFModal
          isOpen={this.state.isOpen}
          title="选取病灶（评估标准：RECIST1.1）"
          closeButton="true"
          onClose={this.closeModal}
        >
          <div>
            {this.state.status == '2' || this.state.status == '3' ? (
              <div>
                <div> 项目编号：P0000101010 方案编号：DSD-123SDF-123123</div>
                <div> 中心编号：011 受试者筛选号：0110003 访视：筛选期</div>
                <div>评估状态：评估中</div>
                <div className="tabletitle margin">图像质量评价</div>
                <table border="1">
                  <thead>
                    <tr>
                      <th>检查日期</th>
                      <th>检查方式</th>
                      <th>检查部位</th>
                      <th>影像增强方案</th>
                      <th>备注</th>
                      <th>图像质量评价</th>
                      <th>图像评价备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2021-10-30</td>
                      <td>CT</td>
                      <td>胸部,腹部,盆腔</td>
                      <td>增强</td>
                      <td>病灶备注</td>
                      <td>
                        <select>
                          <option value="volvo">好</option>
                          <option value="saab">尚可</option>
                          <option value="opel">差</option>
                          <option value="audi">不可评估</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="fname"
                          placeholder="请输入备注"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>2021-11-17</td>
                      <td>MR</td>
                      <td>头部</td>
                      <td>平扫</td>
                      <td>-</td>
                      <td>
                        <select>
                          <option value="volvo">好</option>
                          <option value="saab">尚可</option>
                          <option value="opel">差</option>
                          <option value="audi">不可评估</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="fname"
                          placeholder="请输入备注"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              ''
            )}
            <div className="tabletitle margin">
              靶病灶选取
              <span className="tIntro">
                （注：靶病灶总数≤5个，每个脏器≤2个）
              </span>
            </div>
            <table border="1">
              <thead>
                <tr>
                  <th>
                    <input name="flag" type="checkbox" checked="checked" />
                  </th>
                  <th>病灶编号</th>
                  <th>检查日期</th>
                  <th>检查方式</th>
                  <th>序列号</th>
                  <th>图像号</th>
                  <th>一级器官</th>
                  <th>二级器官</th>
                  <th>测量类型</th>
                  <th>测量结果</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input name="flag" type="checkbox" checked="checked" />
                  </td>
                  <td>M1</td>
                  <td>2021-10-30</td>
                  <td>CT</td>
                  <td>201</td>
                  <td>102</td>
                  <td>脑</td>
                  <td>额叶</td>
                  <td>短径</td>
                  <td>20.02mm</td>
                  <td>病灶备注</td>
                </tr>
                <tr>
                  <td>
                    <input name="flag" type="checkbox" checked="checked" />
                  </td>
                  <td>M2</td>
                  <td>2021-11-17</td>
                  <td>MR</td>
                  <td>201</td>
                  <td>102</td>
                  <td>淋巴结</td>
                  <td>锁骨下</td>
                  <td>长径</td>
                  <td>9.05mm</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <div className="tabletitle margin">非靶病灶选取</div>
            <table border="1">
              <thead>
                <tr>
                  <th>
                    <input name="flag" type="checkbox" checked="checked" />
                  </th>
                  <th>病灶编号</th>
                  <th>检查日期</th>
                  <th>检查方式</th>
                  <th>序列号</th>
                  <th>图像号</th>
                  <th>一级器官</th>
                  <th>二级器官</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input name="flag" type="checkbox" checked="checked" />
                  </td>
                  <td>A1</td>
                  <td>2021-10-30</td>
                  <td>CT</td>
                  <td>201</td>
                  <td>102</td>
                  <td>脑</td>
                  <td>额叶</td>
                  <td>病灶备注</td>
                </tr>
                <tr>
                  <td>
                    <input name="flag" type="checkbox" checked="checked" />
                  </td>
                  <td>M2</td>
                  <td>2021-11-17</td>
                  <td>MR</td>
                  <td>201</td>
                  <td>102</td>
                  <td>淋巴结</td>
                  <td>锁骨下</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            {this.state.status == '2' || this.state.status == '3' ? (
              <div className="tabletitle margin">备注</div>
            ) : (
              ''
            )}
            {this.state.status == '2' || this.state.status == '3' ? (
              <textarea cols="15" rows="3" className="textarea"></textarea>
            ) : (
              ''
            )}
            {this.state.status == '1' ? (
              <div className="sure" onClick={this.setSatus2}>
                确定
              </div>
            ) : (
              ''
            )}
            {this.state.status == '1' ? <div className="cancel">取消</div> : ''}
            {this.state.status == '2' ? (
              <div className="sure" onClick={this.showModal2}>
                完成提交
              </div>
            ) : (
              ''
            )}
            {this.state.status == '2' ? <div className="cancel">取消</div> : ''}
            {this.state.status == '3' ? (
              <div>
                签名：张三 &nbsp;&nbsp;签名时间：2022-03-07 12:18:52&nbsp;&nbsp;
                <span className="redColor">已评估</span>
              </div>
            ) : (
              ''
            )}
          </div>
        </OHIFModal>
        <OHIFModal
          isOpen={this.state.isOpen2}
          title="完成提交"
          closeButton="true"
          onClose={this.closeModal}
        >
          <div className="tabletitle margin">签名声明</div>
          <div>
            本人确认，此病例报告表是由我完成的，在我的经验和知识范围内，我已尽可能的确保【病例报告表】的准确性和完整性。通过输入本人的用户密码，并单击【签名】按钮，完成本人电子签名，与本人手写签名具有同等的法律约束力。
          </div>
          <div className="account">账户： 张三（212312）</div>
          <div className="password1">
            <div className="password">
              <div>密码：</div>
              <div>
                <input type="text" name="fname" placeholder="请输入密码" />
              </div>
            </div>
          </div>
          <div className="sure" onClick={this.setSatus3}>
            签名
          </div>
          <div className="cancel">取消</div>
        </OHIFModal>
      </div>
    );
  }

  setSatus2 = () => {
    this.setState({
      status: 2,
    });
  };
  showModal2 = () => {
    this.setState({
      isOpen2: true,
    });
  };
  setSatus3 = () => {
    this.setState({
      status: 3,
      isOpen2: false,
    });
  };
  closeModal = () => {
    this.setState({
      isOpen: false,
    });
  };
  showModal = () => {
    this.setState({
      isOpen: true,
    });
  };

  saveFunction = async event => {
    const { saveFunction, onSaveComplete } = this.props;
    if (saveFunction) {
      try {
        const result = await saveFunction();
        if (onSaveComplete) {
          onSaveComplete({
            title: 'STOW SR',
            message: result.message,
            type: 'success',
          });
        }
      } catch (error) {
        if (onSaveComplete) {
          onSaveComplete({
            title: 'STOW SR',
            message: error.message,
            type: 'error',
          });
        }
      }
    }
  };

  getMeasurementsGroups = () => {
    return this.props.measurementCollection.map((measureGroup, index) => {
      return (
        <TableList
          key={index}
          customHeader={this.getCustomHeader(measureGroup)}
        >
          {this.getMeasurements(measureGroup)}
        </TableList>
      );
    });
  };

  getMeasurements = measureGroup => {
    const selectedKey = this.props.selectedMeasurementNumber
      ? this.props.selectedMeasurementNumber
      : this.state.selectedKey;
    return measureGroup.measurements.map((measurement, index) => {
      const key = measurement.measurementNumber;
      const itemIndex = measurement.itemNumber || index + 1;
      const itemClass =
        selectedKey === key && !this.props.readOnly ? 'selected' : '';
      return (
        <MeasurementTableItem
          key={key}
          itemIndex={itemIndex}
          itemClass={itemClass}
          measurementData={measurement}
          onItemClick={this.onItemClick}
          onRelabel={this.props.onRelabelClick}
          onDelete={this.props.onDeleteClick}
          onEditDescription={this.props.onEditDescriptionClick}
        />
      );
    });
  };

  onItemClick = (event, measurementData) => {
    if (this.props.readOnly) return;

    this.setState({
      selectedKey: measurementData.measurementNumber,
    });

    if (this.props.onItemClick) {
      this.props.onItemClick(event, measurementData);
    }
  };

  getCustomHeader = measureGroup => {
    return (
      <React.Fragment>
        <div className="tableListHeaderTitle">
          {this.props.t(measureGroup.groupName)}
        </div>
        {measureGroup.maxMeasurements && (
          <div className="maxMeasurements">
            {this.props.t('MAX')} {measureGroup.maxMeasurements}
          </div>
        )}
        <div className="numberOfItems">{measureGroup.measurements.length}</div>
      </React.Fragment>
    );
  };

  getTimepointsHeader = () => {
    const { timepoints, t } = this.props;

    return timepoints.map((timepoint, index) => {
      return (
        <div key={index} className="measurementTableHeaderItem">
          <div className="timepointLabel">{t(timepoint.key)}</div>
          <div className="timepointDate">{timepoint.date}</div>
        </div>
      );
    });
  };

  getWarningContent = () => {
    const { warningList = '' } = this.props.overallWarnings;

    if (Array.isArray(warningList)) {
      const listedWarnings = warningList.map((warn, index) => {
        return <li key={index}>{warn}</li>;
      });

      return <ol>{listedWarnings}</ol>;
    } else {
      return <React.Fragment>{warningList}</React.Fragment>;
    }
  };
}

const connectedComponent = withTranslation(['MeasurementTable', 'Common'])(
  MeasurementTable
);
export { connectedComponent as MeasurementTable };
export default connectedComponent;
