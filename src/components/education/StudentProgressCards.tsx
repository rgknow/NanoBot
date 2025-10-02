/**
 * Student Progress Cards Component
 * 
 * Visual progress tracking with achievement displays and safety monitoring
 */

'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress, 
  Badge, 
  Avatar, 
  Button, 
  Tag, 
  Statistic,
  Tooltip,
  Space,
  Divider,
  Timeline,
  Modal
} from 'antd';
import {
  TrophyOutlined,
  StarFilled,
  BookOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CalendarOutlined,
  BulbOutlined,
  SafetyOutlined,
  GiftOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import { Flexbox } from 'react-layout-kit';
import { createStyles } from 'antd-style';
import { useGuardrailStore } from '@/store/guardrails/store';

const useStyles = createStyles(({ css, token }) => ({
  progressContainer: css`
    padding: ${token.paddingLG}px;
    background: ${token.colorBgLayout};
  `,
  
  heroCard: css`
    background: linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryBg});
    color: white;
    border: none;
    margin-bottom: ${token.marginLG}px;
    
    .ant-card-body {
      padding: ${token.paddingXL}px;
    }
    
    .ant-statistic-title {
      color: rgba(255, 255, 255, 0.8);
    }
    
    .ant-statistic-content {
      color: white;
    }
  `,
  
  progressCard: css`
    height: 100%;
    border-radius: ${token.borderRadius}px;
    box-shadow: ${token.boxShadowSecondary};
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${token.boxShadowTertiary};
    }
  `,
  
  subjectIcon: css`
    font-size: 24px;
    margin-bottom: ${token.marginSM}px;
  `,
  
  achievementBadge: css`
    position: relative;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &.earned {
      filter: none;
    }
    
    &.locked {
      filter: grayscale(100%) opacity(0.4);
    }
  `,
  
  streakIndicator: css`
    display: flex;
    align-items: center;
    gap: ${token.marginXS}px;
    padding: ${token.paddingSM}px ${token.paddingMD}px;
    background: ${token.colorWarningBg};
    border-radius: ${token.borderRadius}px;
    color: ${token.colorWarning};
    font-weight: 500;
  `,
  
  safetyScore: css`
    padding: ${token.paddingSM}px;
    background: ${token.colorSuccessBg};
    border-radius: ${token.borderRadius}px;
    text-align: center;
    border: 1px solid ${token.colorSuccessBorder};
  `,
  
  timelineCard: css`
    max-height: 300px;
    overflow-y: auto;
  `,
  
  levelBadge: css`
    background: ${token.colorPrimaryBg};
    color: ${token.colorPrimary};
    border: 1px solid ${token.colorPrimary};
    font-weight: 600;
    font-size: 12px;
    padding: 2px 8px;
  `,
  
  nextGoal: css`
    background: ${token.colorInfoBg};
    border: 1px solid ${token.colorInfoBorder};
    border-radius: ${token.borderRadius}px;
    padding: ${token.paddingMD}px;
    text-align: center;
  `
}));

interface Subject {
  id: string;
  name: string;
  icon: string;
  progress: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  completedLessons: number;
  totalLessons: number;
  lastActivity: Date;
  achievements: Achievement[];
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  maxProgress?: number;
}

interface StudentProgressProps {
  studentId: string;
  studentName: string;
  studentGrade: string;
  userRole: 'student' | 'teacher' | 'parent' | 'tutor' | 'admin';
}

const StudentProgressCards: React.FC<StudentProgressProps> = ({
  studentId,
  studentName,
  studentGrade,
  userRole
}) => {
  const { styles } = useStyles();
  const { safetyStatus } = useGuardrailStore();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Mock data for demonstration
  const mockSubjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '🔢',
      progress: 78,
      level: 5,
      xp: 2340,
      nextLevelXp: 3000,
      streak: 7,
      completedLessons: 23,
      totalLessons: 30,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      color: '#1890ff',
      achievements: [
        {
          id: 'math-streak-7',
          title: 'Week Warrior',
          description: 'Complete math lessons for 7 days in a row',
          icon: '🔥',
          rarity: 'rare',
          earned: true,
          earnedDate: new Date()
        },
        {
          id: 'math-perfect-10',
          title: 'Perfect Ten',
          description: 'Get 10 perfect scores in a row',
          icon: '⭐',
          rarity: 'epic',
          earned: false,
          progress: 7,
          maxProgress: 10
        }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      progress: 65,
      level: 4,
      xp: 1890,
      nextLevelXp: 2500,
      streak: 3,
      completedLessons: 19,
      totalLessons: 28,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      color: '#52c41a',
      achievements: [
        {
          id: 'science-explorer',
          title: 'Young Explorer',
          description: 'Complete 15 science experiments',
          icon: '🧪',
          rarity: 'common',
          earned: true,
          earnedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
        }
      ]
    },
    {
      id: 'reading',
      name: 'Reading',
      icon: '📚',
      progress: 92,
      level: 6,
      xp: 3120,
      nextLevelXp: 3500,
      streak: 12,
      completedLessons: 34,
      totalLessons: 37,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      color: '#722ed1',
      achievements: [
        {
          id: 'reading-bookworm',
          title: 'Bookworm',
          description: 'Read for 12 days straight',
          icon: '🐛',
          rarity: 'legendary',
          earned: true,
          earnedDate: new Date()
        },
        {
          id: 'reading-speed',
          title: 'Speed Reader',
          description: 'Complete reading exercises under 2 minutes',
          icon: '⚡',
          rarity: 'rare',
          earned: false,
          progress: 3,
          maxProgress: 5
        }
      ]
    }
  ];
  
  const totalXp = mockSubjects.reduce((sum, subject) => sum + subject.xp, 0);
  const averageProgress = mockSubjects.reduce((sum, subject) => sum + subject.progress, 0) / mockSubjects.length;
  const totalAchievements = mockSubjects.reduce((sum, subject) => sum + subject.achievements.filter(a => a.earned).length, 0);
  const longestStreak = Math.max(...mockSubjects.map(s => s.streak));
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#1890ff';
      case 'rare': return '#722ed1';
      case 'epic': return '#fa8c16';
      case 'legendary': return '#f5222d';
      default: return '#1890ff';
    }
  };
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };
  
  return (
    <div className={styles.progressContainer}>
      {/* Hero Overview Card */}
      <Card className={styles.heroCard}>
        <Row gutter={[24, 24]} align="middle">
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} style={{ backgroundColor: '#fff', color: '#1890ff', fontSize: '32px' }}>
                {studentName.charAt(0)}
              </Avatar>
              <h2 style={{ color: 'white', margin: '12px 0 4px 0' }}>{studentName}</h2>
              <Tag className={styles.levelBadge}>Grade {studentGrade}</Tag>
            </div>
          </Col>
          <Col span={18}>
            <Row gutter={[24, 0]}>
              <Col span={6}>
                <Statistic
                  title="Total XP"
                  value={totalXp}
                  prefix={<StarFilled />}
                  valueStyle={{ color: 'white' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Average Progress"
                  value={Math.round(averageProgress)}
                  suffix="%"
                  prefix={<BookOutlined />}
                  valueStyle={{ color: 'white' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Achievements"
                  value={totalAchievements}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: 'white' }}
                />
              </Col>
              <Col span={6}>
                <div className={styles.safetyScore}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a', marginBottom: 4 }}>
                    {safetyStatus.safetyScore}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#52c41a' }}>
                    <SafetyOutlined /> Safety Score
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      
      <Row gutter={[16, 16]}>
        {/* Subject Progress Cards */}
        {mockSubjects.map((subject) => (
          <Col key={subject.id} xs={24} sm={12} lg={8}>
            <Card className={styles.progressCard}>
              <Flexbox justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: '24px' }}>{subject.icon}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>{subject.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>
                      Level {subject.level} • {subject.xp} XP
                    </p>
                  </div>
                </div>
                {subject.streak > 0 && (
                  <div className={styles.streakIndicator}>
                    <FireOutlined />
                    {subject.streak}
                  </div>
                )}
              </Flexbox>
              
              <div style={{ marginBottom: 16 }}>
                <Flexbox justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>Progress</span>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    {subject.completedLessons}/{subject.totalLessons} lessons
                  </span>
                </Flexbox>
                <Progress 
                  percent={subject.progress}
                  strokeColor={subject.color}
                  size="small"
                />
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Flexbox justify="space-between" align="center" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>Level Progress</span>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    {subject.xp}/{subject.nextLevelXp} XP
                  </span>
                </Flexbox>
                <Progress 
                  percent={Math.round((subject.xp / subject.nextLevelXp) * 100)}
                  strokeColor={{
                    '0%': subject.color,
                    '100%': '#87d068',
                  }}
                  size="small"
                />
              </div>
              
              {/* Achievements Preview */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: 8 }}>
                  Recent Achievements
                </div>
                <Space wrap>
                  {subject.achievements.slice(0, 3).map((achievement) => (
                    <Tooltip 
                      key={achievement.id}
                      title={
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{achievement.title}</div>
                          <div>{achievement.description}</div>
                          {!achievement.earned && achievement.progress && (
                            <div>Progress: {achievement.progress}/{achievement.maxProgress}</div>
                          )}
                        </div>
                      }
                    >
                      <Badge 
                        dot={achievement.earned}
                        status={achievement.earned ? "success" : "default"}
                      >
                        <div 
                          className={`${styles.achievementBadge} ${achievement.earned ? 'earned' : 'locked'}`}
                          onClick={() => setSelectedAchievement(achievement)}
                          style={{ 
                            fontSize: '20px',
                            padding: '4px',
                            borderRadius: '4px',
                            backgroundColor: achievement.earned ? getRarityColor(achievement.rarity) + '20' : 'transparent'
                          }}
                        >
                          {achievement.icon}
                        </div>
                      </Badge>
                    </Tooltip>
                  ))}
                  {subject.achievements.length > 3 && (
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>
                      +{subject.achievements.length - 3} more...
                    </span>
                  )}
                </Space>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <Flexbox justify="space-between" align="center">
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  Last activity: {getTimeAgo(subject.lastActivity)}
                </div>
                <Button type="primary" size="small" icon={<PlayCircleOutlined />}>
                  Continue
                </Button>
              </Flexbox>
            </Card>
          </Col>
        ))}
        
        {/* Quick Stats Card */}
        <Col xs={24} sm={12} lg={8}>
          <Card className={styles.progressCard} title="Quick Stats">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <FireOutlined style={{ color: '#fa8c16' }} />
                  <span style={{ fontWeight: 500 }}>Longest Streak</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {longestStreak} days
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CalendarOutlined style={{ color: '#1890ff' }} />
                  <span style={{ fontWeight: 500 }}>This Week</span>
                </div>
                <div style={{ fontSize: '14px', opacity: 0.7 }}>
                  5 lessons completed<br />
                  2.5 hours of learning
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <BulbOutlined style={{ color: '#52c41a' }} />
                  <span style={{ fontWeight: 500 }}>Learning Goal</span>
                </div>
                <div className={styles.nextGoal}>
                  <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  Reach Level 7 in Reading
                  <Progress 
                    percent={85} 
                    size="small" 
                    style={{ marginTop: 8 }}
                    strokeColor="#1890ff"
                  />
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        
        {/* Activity Timeline */}
        <Col xs={24} lg={16}>
          <Card title="Recent Activity" className={styles.progressCard}>
            <div className={styles.timelineCard}>
              <Timeline>
                <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
                  <div style={{ marginBottom: 4 }}>
                    <strong>Completed "Fractions Made Easy"</strong>
                    <Tag style={{ marginLeft: 8 }} color="blue">Mathematics</Tag>
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>2 hours ago • +50 XP</div>
                </Timeline.Item>
                
                <Timeline.Item color="gold" dot={<TrophyOutlined />}>
                  <div style={{ marginBottom: 4 }}>
                    <strong>Earned "Week Warrior" achievement</strong>
                    <Tag style={{ marginLeft: 8 }} color="purple">Achievement</Tag>
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>3 hours ago • 7-day streak!</div>
                </Timeline.Item>
                
                <Timeline.Item color="blue" dot={<BookOutlined />}>
                  <div style={{ marginBottom: 4 }}>
                    <strong>Started "Advanced Reading Comprehension"</strong>
                    <Tag style={{ marginLeft: 8 }} color="purple">Reading</Tag>
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>1 day ago</div>
                </Timeline.Item>
                
                <Timeline.Item color="green" dot={<StarFilled />}>
                  <div style={{ marginBottom: 4 }}>
                    <strong>Perfect score on Science Quiz</strong>
                    <Tag style={{ marginLeft: 8 }} color="green">Science</Tag>
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>2 days ago • +100 XP</div>
                </Timeline.Item>
              </Timeline>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Achievement Details Modal */}
      <Modal
        title="Achievement Details"
        open={!!selectedAchievement}
        onCancel={() => setSelectedAchievement(null)}
        footer={null}
        width={400}
      >
        {selectedAchievement && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: 16 }}>
              {selectedAchievement.icon}
            </div>
            <h2 style={{ 
              color: getRarityColor(selectedAchievement.rarity),
              marginBottom: 8 
            }}>
              {selectedAchievement.title}
            </h2>
            <Tag 
              color={getRarityColor(selectedAchievement.rarity)}
              style={{ marginBottom: 16 }}
            >
              {selectedAchievement.rarity.toUpperCase()}
            </Tag>
            <p style={{ marginBottom: 16, color: '#666' }}>
              {selectedAchievement.description}
            </p>
            
            {selectedAchievement.earned ? (
              <div>
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px', marginBottom: 8 }} />
                <div style={{ color: '#52c41a', fontWeight: 500 }}>EARNED!</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  {selectedAchievement.earnedDate?.toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>Progress</div>
                  <Progress 
                    percent={selectedAchievement.progress && selectedAchievement.maxProgress ? 
                      Math.round((selectedAchievement.progress / selectedAchievement.maxProgress) * 100) : 0
                    }
                    strokeColor={getRarityColor(selectedAchievement.rarity)}
                  />
                  {selectedAchievement.progress && selectedAchievement.maxProgress && (
                    <div style={{ fontSize: '12px', marginTop: 4, opacity: 0.7 }}>
                      {selectedAchievement.progress} / {selectedAchievement.maxProgress}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentProgressCards;