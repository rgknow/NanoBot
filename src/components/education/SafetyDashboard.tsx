/**
 * Safety Dashboard Component
 * 
 * Comprehensive safety monitoring interface for different user roles
 */

'use client';

import React from 'react';
import { Card, Row, Col, Statistic, Progress, Badge, Timeline, Tag } from 'antd';
import { 
  ShieldCheckOutlined, 
  WarningOutlined, 
  SafetyOutlined,
  AlertOutlined,
  UserOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useGuardrailStore, useGuardrailSelectors } from '@/store/guardrails/store';
import { Flexbox } from 'react-layout-kit';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => ({
  safetyCard: css`
    border-radius: ${token.borderRadius}px;
    box-shadow: ${token.boxShadowSecondary};
    margin-bottom: ${token.marginMD}px;
  `,
  
  safetyHeader: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.marginMD}px;
  `,
  
  safetyIcon: css`
    font-size: ${token.fontSizeXL}px;
    
    &.excellent { color: ${token.colorSuccess}; }
    &.good { color: ${token.colorInfo}; }
    &.caution { color: ${token.colorWarning}; }
    &.alert { color: ${token.colorError}; }
  `,
  
  violationItem: css`
    padding: ${token.paddingSM}px;
    border-radius: ${token.borderRadiusSM}px;
    background: ${token.colorBgContainer};
    border-left: 3px solid ${token.colorPrimary};
    margin-bottom: ${token.marginXS}px;
  `,
  
  highSeverity: css`
    border-left-color: ${token.colorError} !important;
  `,
  
  mediumSeverity: css`
    border-left-color: ${token.colorWarning} !important;
  `,
  
  lowSeverity: css`
    border-left-color: ${token.colorInfo} !important;
  `,
  
  metricsGrid: css`
    .ant-statistic {
      text-align: center;
    }
  `,
  
  timelineContainer: css`
    max-height: 400px;
    overflow-y: auto;
    padding: ${token.paddingSM}px;
  `
}));

interface SafetyDashboardProps {
  userRole: 'student' | 'teacher' | 'parent' | 'tutor' | 'admin';
  studentGrade?: string;
  compact?: boolean;
}

const SafetyDashboard: React.FC<SafetyDashboardProps> = ({
  userRole,
  studentGrade,
  compact = false
}) => {
  const { styles } = useStyles();
  const { safetyStatus, recentInteractions, settings } = useGuardrailStore();
  const selectors = useGuardrailSelectors();
  
  const currentSafetyLevel = selectors.getCurrentSafetyLevel()();
  const recentViolations = selectors.getRecentViolations()();
  const highSeverityViolations = selectors.getHighSeverityViolations()();
  
  // Get safety icon based on level
  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'excellent': return <ShieldCheckOutlined className={`${styles.safetyIcon} excellent`} />;
      case 'good': return <SafetyOutlined className={`${styles.safetyIcon} good`} />;
      case 'caution': return <WarningOutlined className={`${styles.safetyIcon} caution`} />;
      case 'alert': return <AlertOutlined className={`${styles.safetyIcon} alert`} />;
      default: return <ShieldCheckOutlined className={styles.safetyIcon} />;
    }
  };
  
  // Get safety color based on level
  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'success';
      case 'good': return 'processing';
      case 'caution': return 'warning';
      case 'alert': return 'exception';
      default: return 'normal';
    }
  };
  
  // Different views based on user role
  if (userRole === 'student' && compact) {
    return (
      <Card className={styles.safetyCard} size="small">
        <Flexbox align="center" gap={12}>
          {getSafetyIcon(currentSafetyLevel)}
          <div>
            <div style={{ fontWeight: 500 }}>Safety Status</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>
              {currentSafetyLevel.charAt(0).toUpperCase() + currentSafetyLevel.slice(1)}
            </div>
          </div>
          <Badge 
            count={safetyStatus.consecutiveViolations} 
            showZero={false}
            style={{ marginLeft: 'auto' }}
          />
        </Flexbox>
      </Card>
    );
  }
  
  if (userRole === 'student') {
    return (
      <Card className={styles.safetyCard} title="My Learning Safety">
        <div className={styles.safetyHeader}>
          {getSafetyIcon(currentSafetyLevel)}
          <div>
            <h3 style={{ margin: 0 }}>
              Safety Level: {currentSafetyLevel.charAt(0).toUpperCase() + currentSafetyLevel.slice(1)}
            </h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Keep up the safe learning! 🌟
            </p>
          </div>
        </div>
        
        <Row gutter={[16, 16]} className={styles.metricsGrid}>
          <Col span={8}>
            <Statistic
              title="Learning Sessions"
              value={safetyStatus.totalInteractions}
              prefix={<BookOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Safety Score"
              value={safetyStatus.safetyScore}
              suffix="%"
              valueStyle={{ color: getSafetyColor(currentSafetyLevel) === 'success' ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {Math.max(0, settings.maxDailyInteractions - safetyStatus.totalInteractions)}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>Interactions Left Today</div>
            </div>
          </Col>
        </Row>
        
        {safetyStatus.consecutiveViolations > 0 && (
          <Card size="small" style={{ marginTop: 16, backgroundColor: '#fff7e6' }}>
            <p style={{ margin: 0 }}>
              <WarningOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
              Please remember to ask appropriate questions for learning. 
              If you need help with other topics, ask your teacher or parent!
            </p>
          </Card>
        )}
      </Card>
    );
  }
  
  // Teacher/Parent/Admin view
  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* Overview Cards */}
        <Col span={6}>
          <Card className={styles.safetyCard}>
            <Statistic
              title="Safety Score"
              value={safetyStatus.safetyScore}
              suffix="%"
              prefix={getSafetyIcon(currentSafetyLevel)}
              valueStyle={{ 
                color: getSafetyColor(currentSafetyLevel) === 'success' ? '#3f8600' : '#cf1322' 
              }}
            />
            <Progress 
              percent={safetyStatus.safetyScore}
              status={getSafetyColor(currentSafetyLevel) as any}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        
        <Col span={6}>
          <Card className={styles.safetyCard}>
            <Statistic
              title="Total Interactions"
              value={safetyStatus.totalInteractions}
              prefix={<UserOutlined />}
            />
            <div style={{ fontSize: '12px', marginTop: 4, opacity: 0.7 }}>
              {safetyStatus.blockedAttempts} blocked attempts
            </div>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card className={styles.safetyCard}>
            <Statistic
              title="Violations This Week"
              value={safetyStatus.violationsThisWeek}
              prefix={<WarningOutlined />}
              valueStyle={{ color: safetyStatus.violationsThisWeek > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col span={6}>
          <Card className={styles.safetyCard}>
            <Statistic
              title="Consecutive Safe Days"
              value={safetyStatus.consecutiveViolations === 0 ? 7 : 0}
              prefix={<ShieldCheckOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Recent Violations */}
        <Col span={12}>
          <Card 
            className={styles.safetyCard}
            title="Recent Safety Events"
            extra={<Badge count={recentViolations.length} showZero />}
          >
            <div className={styles.timelineContainer}>
              {recentViolations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, opacity: 0.5 }}>
                  <ShieldCheckOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <p>No safety incidents to report! 🎉</p>
                </div>
              ) : (
                <Timeline>
                  {recentViolations.map((interaction) => (
                    <Timeline.Item
                      key={interaction.id}
                      color={
                        interaction.violations.some(v => v.severity === 'high') ? 'red' :
                        interaction.violations.some(v => v.severity === 'medium') ? 'orange' : 'blue'
                      }
                    >
                      <div className={styles.violationItem}>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>
                          {interaction.timestamp.toLocaleDateString()} at{' '}
                          {interaction.timestamp.toLocaleTimeString()}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Tag color="blue">{interaction.userRole}</Tag>
                          {interaction.studentGrade && (
                            <Tag color="green">Grade {interaction.studentGrade}</Tag>
                          )}
                          {interaction.subject && (
                            <Tag color="purple">{interaction.subject}</Tag>
                          )}
                        </div>
                        <div>
                          {interaction.violations.map((violation, index) => (
                            <Tag
                              key={index}
                              color={
                                violation.severity === 'high' ? 'red' :
                                violation.severity === 'medium' ? 'orange' : 'blue'
                              }
                              style={{ marginBottom: 4 }}
                            >
                              {violation.type}: {violation.message}
                            </Tag>
                          ))}
                        </div>
                        {interaction.wasBlocked && (
                          <Tag color="red" style={{ marginTop: 4 }}>
                            ⛔ Blocked
                          </Tag>
                        )}
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              )}
            </div>
          </Card>
        </Col>
        
        {/* High Priority Alerts */}
        <Col span={12}>
          <Card 
            className={styles.safetyCard}
            title="High Priority Alerts"
            extra={<Badge count={highSeverityViolations.length} showZero />}
          >
            <div className={styles.timelineContainer}>
              {highSeverityViolations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, opacity: 0.5 }}>
                  <SafetyOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <p>No high-priority safety alerts</p>
                </div>
              ) : (
                highSeverityViolations.map((interaction) => (
                  <div key={interaction.id} className={`${styles.violationItem} ${styles.highSeverity}`}>
                    <div style={{ fontWeight: 500, color: '#cf1322', marginBottom: 4 }}>
                      ⚠️ HIGH PRIORITY ALERT
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      {interaction.timestamp.toLocaleDateString()} at{' '}
                      {interaction.timestamp.toLocaleTimeString()}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{interaction.userRole}</Tag>
                      {interaction.studentGrade && (
                        <Tag color="green">Grade {interaction.studentGrade}</Tag>
                      )}
                    </div>
                    {interaction.violations.filter(v => v.severity === 'high').map((violation, index) => (
                      <div key={index} style={{ marginBottom: 4 }}>
                        <strong>{violation.type}:</strong> {violation.message}
                        <br />
                        <small style={{ opacity: 0.7 }}>
                          Action needed: {violation.suggestedAction}
                        </small>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SafetyDashboard;