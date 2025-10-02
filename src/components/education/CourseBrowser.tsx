/**
 * Educational Course Browser Component
 * 
 * Browse and access educational courses with safety-integrated features
 */

'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Tag, 
  Progress, 
  Avatar, 
  Input, 
  Select,
  Tooltip,
  Space
} from 'antd';
import {
  BookOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  StarFilled,
  UserOutlined,
  SafetyOutlined,
  ShieldCheckOutlined
} from '@ant-design/icons';
import { Flexbox } from 'react-layout-kit';
import { createStyles } from 'antd-style';
import { useGuardrailStore } from '@/store/guardrails/store';
import SafetyDashboard from './SafetyDashboard';

const { Search } = Input;
const { Option } = Select;

const useStyles = createStyles(({ css, token }) => ({
  browserContainer: css`
    padding: ${token.paddingLG}px;
    background: ${token.colorBgLayout};
    min-height: 100vh;
  `,
  
  courseCard: css`
    height: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: ${token.borderRadius}px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${token.boxShadowTertiary};
    }
    
    .ant-card-body {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  
  courseHeader: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.marginMD}px;
  `,
  
  courseIcon: css`
    font-size: ${token.fontSizeXL}px;
    color: ${token.colorPrimary};
  `,
  
  courseStats: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${token.marginMD}px 0;
    padding: ${token.paddingSM}px 0;
    border-top: 1px solid ${token.colorBorderSecondary};
  `,
  
  courseSubtitle: css`
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeSM}px;
    margin: 0;
  `,
  
  courseTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: 600;
    margin: 0;
    color: ${token.colorText};
  `,
  
  filterSection: css`
    background: ${token.colorBgContainer};
    padding: ${token.paddingMD}px;
    border-radius: ${token.borderRadius}px;
    margin-bottom: ${token.marginLG}px;
  `,
  
  gradeBadge: css`
    background: ${token.colorPrimaryBg};
    color: ${token.colorPrimary};
    border: 1px solid ${token.colorPrimary};
    font-weight: 500;
  `,
  
  headerSection: css`
    background: ${token.colorBgContainer};
    padding: ${token.paddingLG}px;
    border-radius: ${token.borderRadius}px;
    margin-bottom: ${token.marginLG}px;
    box-shadow: ${token.boxShadowSecondary};
  `,
  
  progressSection: css`
    margin-top: auto;
    padding-top: ${token.paddingMD}px;
  `,
  
  safetyBadge: css`
    position: absolute;
    top: ${token.paddingSM}px;
    right: ${token.paddingSM}px;
  `,
  
  safetyIndicator: css`
    &.safe { color: ${token.colorSuccess}; }
    &.caution { color: ${token.colorWarning}; }
    &.restricted { color: ${token.colorError}; }
  `,
  
  statItem: css`
    display: flex;
    align-items: center;
    gap: ${token.marginXS}px;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
  `
}));

interface Course {
  completedLessons: number;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  gradeLevel: string[];
  id: string;
  instructor: string;
  lessons: number;
  prerequisites: string[];
  rating: number;
  safetyLevel: 'safe' | 'caution' | 'restricted';
  subject: string;
  title: string;
  topics: string[];
}

interface CourseBrowserProps {
  onCourseSelect?: (course: Course) => void;
  studentGrade?: string;
  userRole: 'student' | 'teacher' | 'parent' | 'tutor' | 'admin';
}

const CourseBrowser: React.FC<CourseBrowserProps> = ({
  userRole,
  studentGrade,
  onCourseSelect
}) => {
  const { styles } = useStyles();
  const { settings } = useGuardrailStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<string | undefined>(studentGrade);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();
  const [showSafetyDashboard, setShowSafetyDashboard] = useState(false);
  
  // Mock courses data
  const mockCourses: Course[] = [
    {
      completedLessons: 8,
      description: 'Learn fundamental math concepts including addition, subtraction, multiplication, and division.',
      difficulty: 'beginner',
      duration: '6 weeks',
      gradeLevel: ['K', '1', '2', '3'],
      id: 'math-101',
      instructor: 'Ms. Johnson',
      lessons: 24,
      prerequisites: [],
      subject: 'Mathematics',
      rating: 4.8,
      title: 'Basic Mathematics',
      safetyLevel: 'safe',
      topics: ['numbers', 'counting', 'basic operations', 'problem solving']
    },
    {
      completedLessons: 12,
      description: 'Explore the wonders of science through fun experiments and observations.',
      difficulty: 'beginner',
      duration: '8 weeks',
      gradeLevel: ['3', '4', '5'],
      id: 'science-101',
      instructor: 'Dr. Smith',
      lessons: 32,
      prerequisites: [],
      subject: 'Science',
      rating: 4.9,
      title: 'Introduction to Science',
      safetyLevel: 'safe',
      topics: ['experiments', 'observation', 'nature', 'scientific method']
    },
    {
      completedLessons: 25,
      description: 'Develop advanced reading skills and critical thinking through literature analysis.',
      difficulty: 'intermediate',
      duration: '10 weeks',
      gradeLevel: ['6', '7', '8'],
      id: 'reading-advanced',
      instructor: 'Mr. Davis',
      lessons: 40,
      prerequisites: ['basic reading skills'],
      subject: 'English',
      rating: 4.7,
      title: 'Advanced Reading Comprehension',
      safetyLevel: 'safe',
      topics: ['literature', 'analysis', 'comprehension', 'writing']
    },
    {
      completedLessons: 30,
      description: 'Journey through major historical events and civilizations.',
      difficulty: 'intermediate',
      duration: '12 weeks',
      gradeLevel: ['9', '10', '11', '12'],
      id: 'history-world',
      instructor: 'Prof. Williams',
      lessons: 48,
      prerequisites: ['basic history knowledge'],
      subject: 'History',
      rating: 4.6,
      title: 'World History Overview',
      safetyLevel: 'caution',
      topics: ['civilizations', 'wars', 'politics', 'culture']
    },
    {
      completedLessons: 15,
      description: 'Learn basic chemistry concepts and safe laboratory practices.',
      difficulty: 'intermediate',
      duration: '14 weeks',
      gradeLevel: ['9', '10', '11', '12'],
      id: 'chemistry-101',
      instructor: 'Dr. Brown',
      lessons: 56,
      prerequisites: ['algebra', 'basic science'],
      subject: 'Science',
      rating: 4.5,
      title: 'Introduction to Chemistry',
      safetyLevel: 'caution',
      topics: ['atoms', 'molecules', 'reactions', 'lab safety']
    }
  ];
  
  // Filter courses based on user role and settings
  const filteredCourses = mockCourses.filter(course => {
    // Search filter
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !course.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !course.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Subject filter
    if (selectedSubject && course.subject !== selectedSubject) return false;
    
    // Grade filter
    if (selectedGrade && !course.gradeLevel.includes(selectedGrade)) return false;
    
    // Difficulty filter
    if (selectedDifficulty && course.difficulty !== selectedDifficulty) return false;
    
    // Safety-based filtering for students
    if (userRole === 'student') {
      // Check if course topics are allowed
      const hasBlockedTopics = course.topics.some(topic => 
        settings.blockedTopics.includes(topic)
      );
      if (hasBlockedTopics) return false;
      
      // Restrict courses based on safety level and strict mode
      if (settings.strictMode && course.safetyLevel === 'caution') return false;
      if (course.safetyLevel === 'restricted') return false;
    }
    
    return true;
  });
  
  const getSafetyIcon = (level: string) => {
    switch (level) {
      case 'safe': { return <ShieldCheckOutlined className={`${styles.safetyIndicator} safe`} />;
      }
      case 'caution': { return <SafetyOutlined className={`${styles.safetyIndicator} caution`} />;
      }
      case 'restricted': { return <SafetyOutlined className={`${styles.safetyIndicator} restricted`} />;
      }
      default: { return <SafetyOutlined />;
      }
    }
  };
  
  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': { return '🔢';
      }
      case 'science': { return '🔬';
      }
      case 'english': { return '📚';
      }
      case 'history': { return '🏛️';
      }
      case 'art': { return '🎨';
      }
      case 'music': { return '🎵';
      }
      default: { return '📖';
      }
    }
  };
  
  return (
    <div className={styles.browserContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <Flexbox align="center" justify="space-between">
          <div>
            <h1 style={{ fontSize: '24px', margin: 0 }}>
              {getSubjectIcon('education')} Course Browser
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.7 }}>
              Discover safe and engaging educational content
              {studentGrade && ` for Grade ${studentGrade}`}
            </p>
          </div>
          <Space>
            <Button 
              icon={<SafetyOutlined />} 
              onClick={() => setShowSafetyDashboard(!showSafetyDashboard)}
              type="primary"
            >
              Safety Dashboard
            </Button>
            {userRole !== 'student' && (
              <Button icon={<FilterOutlined />}>
                Advanced Filters
              </Button>
            )}
          </Space>
        </Flexbox>
      </div>
      
      {/* Safety Dashboard */}
      {showSafetyDashboard && (
        <Card style={{ marginBottom: 24 }}>
          <SafetyDashboard 
            compact={false} 
            studentGrade={studentGrade}
            userRole={userRole}
          />
        </Card>
      )}
      
      {/* Filter Section */}
      <div className={styles.filterSection}>
        <Row align="middle" gutter={[16, 16]}>
          <Col span={8}>
            <Search
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses, subjects, or topics..."
              prefix={<SearchOutlined />}
              value={searchTerm}
            />
          </Col>
          <Col span={4}>
            <Select
              allowClear
              onChange={setSelectedSubject}
              placeholder="Subject"
              style={{ width: '100%' }}
              value={selectedSubject}
            >
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Science">Science</Option>
              <Option value="English">English</Option>
              <Option value="History">History</Option>
              <Option value="Art">Art</Option>
              <Option value="Music">Music</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              allowClear
              onChange={setSelectedGrade}
              placeholder="Grade Level"
              style={{ width: '100%' }}
              value={selectedGrade}
            >
              {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <Option key={grade} value={grade}>Grade {grade}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              allowClear
              onChange={setSelectedDifficulty}
              placeholder="Difficulty"
              style={{ width: '100%' }}
              value={selectedDifficulty}
            >
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
          </Col>
          <Col span={4}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {filteredCourses.length}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                Available Courses
              </div>
            </div>
          </Col>
        </Row>
      </div>
      
      {/* Course Grid */}
      <Row gutter={[16, 16]}>
        {filteredCourses.map((course) => (
          <Col key={course.id} lg={8} sm={12} xl={6} xs={24}>
            <Card 
              className={styles.courseCard}
              onClick={() => onCourseSelect?.(course)}
            >
              <div className={styles.safetyBadge}>
                <Tooltip title={`Safety Level: ${course.safetyLevel}`}>
                  {getSafetyIcon(course.safetyLevel)}
                </Tooltip>
              </div>
              
              <div className={styles.courseHeader}>
                <div style={{ fontSize: '24px' }}>
                  {getSubjectIcon(course.subject)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseSubtitle}>{course.subject}</p>
                </div>
              </div>
              
              <p style={{ flex: 1, lineHeight: 1.4, marginBottom: 16 }}>
                {course.description}
              </p>
              
              <div style={{ marginBottom: 16 }}>
                <Space wrap>
                  {course.gradeLevel.map(grade => (
                    <Tag 
                      className={styles.gradeBadge} 
                      key={grade}
                      size="small"
                    >
                      Grade {grade}
                    </Tag>
                  ))}
                  <Tag color="blue" size="small">
                    {course.difficulty}
                  </Tag>
                </Space>
              </div>
              
              <div className={styles.courseStats}>
                <span className={styles.statItem}>
                  <BookOutlined />
                  {course.lessons} lessons
                </span>
                <span className={styles.statItem}>
                  <ClockCircleOutlined />
                  {course.duration}
                </span>
                <span className={styles.statItem}>
                  <StarFilled style={{ color: '#faad14' }} />
                  {course.rating}
                </span>
              </div>
              
              <div className={styles.progressSection}>
                <Flexbox align="center" justify="space-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    Progress
                  </span>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>
                    {course.completedLessons}/{course.lessons}
                  </span>
                </Flexbox>
                <Progress 
                  percent={Math.round((course.completedLessons / course.lessons) * 100)}
                  size="small"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                
                <Flexbox align="center" justify="space-between" style={{ marginTop: 16 }}>
                  <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                    <Avatar icon={<UserOutlined />} size="small" />
                    <span style={{ fontSize: '12px' }}>{course.instructor}</span>
                  </div>
                  <Button 
                    icon={<PlayCircleOutlined />} 
                    size="small"
                    type="primary"
                  >
                    {course.completedLessons > 0 ? 'Continue' : 'Start'}
                  </Button>
                </Flexbox>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      {filteredCourses.length === 0 && (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <BookOutlined style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }} />
          <h3>No courses found</h3>
          <p style={{ opacity: 0.7 }}>
            Try adjusting your search criteria or contact your teacher for more course options.
          </p>
          {userRole === 'student' && settings.strictMode && (
            <p style={{ color: '#faad14', marginTop: 16 }}>
              <SafetyOutlined /> Some courses may be hidden due to safety settings.
              Ask your parent or teacher if you need access to additional content.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default CourseBrowser;