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
  Badge,
  Tooltip,
  Space,
  Divider
} from 'antd';
import {
  BookOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
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
  
  headerSection: css`
    background: ${token.colorBgContainer};
    padding: ${token.paddingLG}px;
    border-radius: ${token.borderRadius}px;
    margin-bottom: ${token.marginLG}px;
    box-shadow: ${token.boxShadowSecondary};
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
  
  courseTitle: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: 600;
    margin: 0;
    color: ${token.colorText};
  `,
  
  courseSubtitle: css`
    color: ${token.colorTextSecondary};
    font-size: ${token.fontSizeSM}px;
    margin: 0;
  `,
  
  courseStats: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${token.marginMD}px 0;
    padding: ${token.paddingSM}px 0;
    border-top: 1px solid ${token.colorBorderSecondary};
  `,
  
  statItem: css`
    display: flex;
    align-items: center;
    gap: ${token.marginXS}px;
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextSecondary};
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
  
  safetyIndicator: css`
    &.safe { color: ${token.colorSuccess}; }
    &.caution { color: ${token.colorWarning}; }
    &.restricted { color: ${token.colorError}; }
  `
}));

interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  gradeLevel: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  completedLessons: number;
  rating: number;
  instructor: string;
  safetyLevel: 'safe' | 'caution' | 'restricted';
  topics: string[];
  prerequisites: string[];
}

interface CourseBrowserProps {
  userRole: 'student' | 'teacher' | 'parent' | 'tutor' | 'admin';
  studentGrade?: string;
  onCourseSelect?: (course: Course) => void;
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
      id: 'math-101',
      title: 'Basic Mathematics',
      subject: 'Mathematics',
      description: 'Learn fundamental math concepts including addition, subtraction, multiplication, and division.',
      gradeLevel: ['K', '1', '2', '3'],
      difficulty: 'beginner',
      duration: '6 weeks',
      lessons: 24,
      completedLessons: 8,
      rating: 4.8,
      instructor: 'Ms. Johnson',
      safetyLevel: 'safe',
      topics: ['numbers', 'counting', 'basic operations', 'problem solving'],
      prerequisites: []
    },
    {
      id: 'science-101',
      title: 'Introduction to Science',
      subject: 'Science',
      description: 'Explore the wonders of science through fun experiments and observations.',
      gradeLevel: ['3', '4', '5'],
      difficulty: 'beginner',
      duration: '8 weeks',
      lessons: 32,
      completedLessons: 12,
      rating: 4.9,
      instructor: 'Dr. Smith',
      safetyLevel: 'safe',
      topics: ['experiments', 'observation', 'nature', 'scientific method'],
      prerequisites: []
    },
    {
      id: 'reading-advanced',
      title: 'Advanced Reading Comprehension',
      subject: 'English',
      description: 'Develop advanced reading skills and critical thinking through literature analysis.',
      gradeLevel: ['6', '7', '8'],
      difficulty: 'intermediate',
      duration: '10 weeks',
      lessons: 40,
      completedLessons: 25,
      rating: 4.7,
      instructor: 'Mr. Davis',
      safetyLevel: 'safe',
      topics: ['literature', 'analysis', 'comprehension', 'writing'],
      prerequisites: ['basic reading skills']
    },
    {
      id: 'history-world',
      title: 'World History Overview',
      subject: 'History',
      description: 'Journey through major historical events and civilizations.',
      gradeLevel: ['9', '10', '11', '12'],
      difficulty: 'intermediate',
      duration: '12 weeks',
      lessons: 48,
      completedLessons: 30,
      rating: 4.6,
      instructor: 'Prof. Williams',
      safetyLevel: 'caution',
      topics: ['civilizations', 'wars', 'politics', 'culture'],
      prerequisites: ['basic history knowledge']
    },
    {
      id: 'chemistry-101',
      title: 'Introduction to Chemistry',
      subject: 'Science',
      description: 'Learn basic chemistry concepts and safe laboratory practices.',
      gradeLevel: ['9', '10', '11', '12'],
      difficulty: 'intermediate',
      duration: '14 weeks',
      lessons: 56,
      completedLessons: 15,
      rating: 4.5,
      instructor: 'Dr. Brown',
      safetyLevel: 'caution',
      topics: ['atoms', 'molecules', 'reactions', 'lab safety'],
      prerequisites: ['algebra', 'basic science']
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
      case 'safe': return <ShieldCheckOutlined className={`${styles.safetyIndicator} safe`} />;
      case 'caution': return <SafetyOutlined className={`${styles.safetyIndicator} caution`} />;
      case 'restricted': return <SafetyOutlined className={`${styles.safetyIndicator} restricted`} />;
      default: return <SafetyOutlined />;
    }
  };
  
  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': return '🔢';
      case 'science': return '🔬';
      case 'english': return '📚';
      case 'history': return '🏛️';
      case 'art': return '🎨';
      case 'music': return '🎵';
      default: return '📖';
    }
  };
  
  return (
    <div className={styles.browserContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <Flexbox justify="space-between" align="center">
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>
              {getSubjectIcon('education')} Course Browser
            </h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.7 }}>
              Discover safe and engaging educational content
              {studentGrade && ` for Grade ${studentGrade}`}
            </p>
          </div>
          <Space>
            <Button 
              type="primary" 
              icon={<SafetyOutlined />}
              onClick={() => setShowSafetyDashboard(!showSafetyDashboard)}
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
            userRole={userRole} 
            studentGrade={studentGrade}
            compact={false}
          />
        </Card>
      )}
      
      {/* Filter Section */}
      <div className={styles.filterSection}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Search
              placeholder="Search courses, subjects, or topics..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Subject"
              allowClear
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: '100%' }}
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
              placeholder="Grade Level"
              allowClear
              value={selectedGrade}
              onChange={setSelectedGrade}
              style={{ width: '100%' }}
            >
              {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <Option key={grade} value={grade}>Grade {grade}</Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Difficulty"
              allowClear
              value={selectedDifficulty}
              onChange={setSelectedDifficulty}
              style={{ width: '100%' }}
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
          <Col key={course.id} xs={24} sm={12} lg={8} xl={6}>
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
              
              <p style={{ flex: 1, marginBottom: 16, lineHeight: 1.4 }}>
                {course.description}
              </p>
              
              <div style={{ marginBottom: 16 }}>
                <Space wrap>
                  {course.gradeLevel.map(grade => (
                    <Tag 
                      key={grade} 
                      className={styles.gradeBadge}
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
                <Flexbox justify="space-between" align="center" style={{ marginBottom: 8 }}>
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
                
                <Flexbox justify="space-between" align="center" style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span style={{ fontSize: '12px' }}>{course.instructor}</span>
                  </div>
                  <Button 
                    type="primary" 
                    size="small"
                    icon={<PlayCircleOutlined />}
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
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <BookOutlined style={{ fontSize: 64, opacity: 0.3, marginBottom: 16 }} />
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