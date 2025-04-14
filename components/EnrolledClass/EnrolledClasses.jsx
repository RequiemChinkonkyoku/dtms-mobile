import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import {
  fetchDogEnrolledClasses,
  fetchClassById,
} from "../../services/ClassService";
import { fetchClassPretests } from "../../services/PretestService";
import { fetchDogClassSlots } from "../../services/ClassService";
import { createVNPayPayment } from "../../services/PaymentService";
import { fetchCourseById } from "../../services/CourseService";
import { useAuth } from "../../contexts/AuthContext";
import * as ExpoLinking from "expo-linking";
import { fetchDogClassProgressReports } from "../../services/ProgressReportService";
import { useRouter } from "expo-router";
import { fetchTrainingReportsByEnrollmentId } from "../../services/TrainingReportService";

export default function EnrolledClasses({ dogId }) {
  const router = useRouter();
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [expandedClass, setExpandedClass] = useState(null);
  const [expandedReports, setExpandedReports] = useState({});
  const [reportsData, setReportsData] = useState({});
  const [classDetails, setClassDetails] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDateSlots, setSelectedDateSlots] = useState([]);
  const [classPretests, setClassPretests] = useState({});
  const [trainingReports, setTrainingReports] = useState({});
  const [expandedTrainingReports, setExpandedTrainingReports] = useState({});

  const { userInfo } = useAuth();

  useEffect(() => {
    loadEnrolledClasses();
  }, [dogId]);

  const loadEnrolledClasses = async () => {
    const classes = await fetchDogEnrolledClasses(dogId);
    const sortedClasses = classes.sort(
      (a, b) => new Date(a.startingDate) - new Date(b.startingDate)
    );
    setEnrolledClasses(sortedClasses);

    for (const classItem of sortedClasses) {
      const details = await fetchClassById(classItem.id);
      const pretests = await fetchClassPretests(classItem.id, dogId);
      setClassDetails(prev => ({ ...prev, [classItem.id]: details }));
      setClassPretests(prev => ({ ...prev, [classItem.id]: pretests }));
    }
  };

  const handleClassExpand = async (classId) => {
    if (expandedClass === classId) {
      setExpandedClass(null);
    } else {
      setExpandedClass(classId);
      if (!classDetails[classId]) {
        const details = await fetchClassById(classId);
        const pretests = await fetchClassPretests(classId, dogId);
        setClassDetails((prev) => ({ ...prev, [classId]: details }));
        setClassPretests((prev) => ({ ...prev, [classId]: pretests }));
      }
    }
  };

  const handleTrainingReportExpand = async (classItem) => {
    try {
      if (expandedTrainingReports[classItem.id]) {
        setExpandedTrainingReports(prev => ({ ...prev, [classItem.id]: false }));
      } else {
        setExpandedTrainingReports(prev => ({ ...prev, [classItem.id]: true }));
        const enrollment = classDetails[classItem.id]?.classEnrollments.find(
          (e) => e.dogId === dogId
        );

        if (!enrollment) {
          Alert.alert("Error", "Enrollment information not found");
          return;
        }

        const reports = await fetchTrainingReportsByEnrollmentId(enrollment.enrollmentId);
        if (reports.success) {
          setTrainingReports(prev => ({ ...prev, [classItem.id]: reports.objectList }));
        }
      }
    } catch (error) {
      console.error("Error fetching training reports:", error);
      Alert.alert("Error", "Failed to fetch training reports");
      setExpandedTrainingReports(prev => ({ ...prev, [classItem.id]: false }));
    }
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    if (
      selectedDateSlots.length > 0 &&
      new Date(selectedDateSlots[0].slotDate).toISOString().split("T")[0] ===
      selectedDate
    ) {
      setSelectedDateSlots([]);
    } else {
      const slots =
        classDetails[selectedClass.id]?.classSlots.filter(
          (slot) =>
            new Date(slot.slotDate).toISOString().split("T")[0] === selectedDate
        ) || [];
      const sortedSlots = slots.sort((a, b) => {
        const timeA = new Date(`2000-01-01T${a.startTime}`);
        const timeB = new Date(`2000-01-01T${b.startTime}`);
        return timeA - timeB;
      });
      setSelectedDateSlots(sortedSlots);
    }
  };

  const handleShowCalendar = async (classItem) => {
    setSelectedClass(classItem);
    const details =
      classDetails[classItem.id] || (await fetchClassById(classItem.id));
    if (!classDetails[classItem.id]) {
      setClassDetails((prev) => ({ ...prev, [classItem.id]: details }));
    }
    const marked = {};
    const today = new Date().toISOString().split("T")[0];

    // Mark all pretest dates first
    classPretests[classItem.id]?.forEach((pretest) => {
      const pretestDate = new Date(pretest.testDate)
        .toISOString()
        .split("T")[0];
      marked[pretestDate] = {
        marked: true,
        selected: true,
        selectedColor: "#ffA500",
        selectedTextColor: "#FFF",
        customStyles: {
          container: {
            backgroundColor: getPretestStatusColor(pretest.status),
            borderRadius: 8,
          },
          text: {
            color: "#FFF",
            fontWeight: "bold",
          },
        },
      };
    });

    // Then mark class slots
    details.classSlots.forEach((slot) => {
      const dateStr = new Date(slot.slotDate).toISOString().split("T")[0];
      const pretestForDate = classPretests[classItem.id]?.find(
        (pretest) =>
          new Date(pretest.testDate).toISOString().split("T")[0] === dateStr
      );

      // If there's no pretest for this date, mark it as a regular class slot
      if (!pretestForDate) {
        marked[dateStr] = {
          selected: true,
          marked: dateStr === today,
          selectedColor: getStatusColor(classItem.status),
          dots: dateStr === today ? [{ color: "#007AFF" }] : undefined,
          customStyles: {
            container: {
              backgroundColor: getStatusColor(classItem.status),
              borderRadius: 8,
            },
            text: {
              color: "white",
              fontWeight: "bold",
            },
          },
        };
      }
    });

    // Make sure today is always marked if it's not already marked
    if (!marked[today]) {
      marked[today] = {
        marked: true,
        dots: [{ color: "#007AFF" }],
      };
    }

    setMarkedDates(marked);
    setShowCalendar(true);
  };

  const getStatusColor = (status) => {
    // switch (status) {
    //   case 0:
    //     return "#8E8E93"; // Inactive
    //   case 1:
    //     return "#34C759"; // Active
    //   case 2:
    //     return "#007AFF"; // Ongoing
    //   case 3:
    //     return "#FF9500"; // Closed
    //   case 4:
    //     return "#FF3B30"; // Completed
    //   default:
    //     return "#8E8E93";
    // }

    switch (status) {
      case 0:
        return '#8E8E93'; // Inactive
      case 1:
        return '#34C759'; // Active
      case 2:
        return '#FF9500'; // Pending
      case 3:
        return '#007AFF'; // Concluded
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status) => {
    // switch (status) {
    //   case 0:
    //     return "Inactive";
    //   case 1:
    //     return "Active";
    //   case 2:
    //     return "Ongoing";
    //   case 3:
    //     return "Closed";
    //   case 4:
    //     return "Completed";
    //   default:
    //     return "Unknown";
    // }

    switch (status) {
      case 0:
        return 'Inactive';
      case 1:
        return 'Active';
      case 2:
        return 'Pending';
      case 3:
        return 'Concluded';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPretestStatusText = (status) => {
    switch (status) {
      case -1:
        return "Cancelled";
      case 0:
        return "Pending";
      case 1:
        return "Accepted";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getPretestStatusColor = (status) => {
    switch (status) {
      case -1:
        return "#8E8E93"; // Cancelled
      case 0:
        return "#FF9500"; // Pending
      case 1:
        return "#34C759"; // Accepted
      case 2:
        return "#FF3B30"; // Rejected
      default:
        return "#8E8E93";
    }
  };

  // Add these new states while keeping existing ones
  const [expandedSlots, setExpandedSlots] = useState({});
  const [slotsData, setSlotsData] = useState({});

  const handleProgressReportExpand = async (classId) => {
    try {
      if (expandedReports[classId]) {
        setExpandedReports((prev) => ({ ...prev, [classId]: false }));
      } else {
        setExpandedReports((prev) => ({ ...prev, [classId]: true }));
        if (!reportsData[classId]) {
          const reports = await fetchDogClassProgressReports(classId, dogId);
          if (reports) {
            setReportsData((prev) => ({ ...prev, [classId]: reports }));
          }
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch progress reports. Please try again later.",
        [{ text: "OK" }]
      );
      setExpandedReports((prev) => ({ ...prev, [classId]: false }));
    }
  };

  const handlePayment = async (classItem) => {
    try {
      const classDetail = classDetails[classItem.id];
      if (
        !classDetail ||
        !classDetail.classEnrollments ||
        classDetail.classEnrollments.length === 0
      ) {
        Alert.alert("Error", "Enrollment information not found");
        return;
      }

      const enrollment = classDetail.classEnrollments.find(
        (e) => e.dogId === dogId
      );
      if (!enrollment) {
        Alert.alert("Error", "Enrollment for this dog not found");
        return;
      }

      // Fetch course details to get the price
      const courseDetails = await fetchCourseById(classDetail.courseId);
      if (!courseDetails) {
        Alert.alert("Error", "Could not fetch course price");
        return;
      }

      const paymentData = {
        orderType: "ClassEnrollment",
        amount: courseDetails.price,
        enrollmentId: enrollment.enrollmentId,
        customerID: userInfo.unique_name,
      };

      const paymentResult = await createVNPayPayment(paymentData);

      if (paymentResult.success && paymentResult.data) {
        // onclose();
        console.log("Payment successful!");
      } else {
        Alert.alert(
          "Payment Failed",
          "Unable to initiate payment. Please try again."
        );
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "Failed to process payment. Please try again.");
    }
  };

  const getSlotStatusColor = (status) => {
    switch (status) {
      case 0:
        return '#FF9500'; // NotYet - Orange
      case 1:
        return '#34C759'; // CheckedIn - Green
      case 2:
        return '#8E8E93'; // Concluded - Gray
      default:
        return '#8E8E93';
    }
  };

  const getSlotStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Not Yet';
      case 1:
        return 'Checked In';
      case 2:
        return 'Concluded';
      default:
        return 'Unknown';
    }
  };

  return (
    <>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Enrolled Classes
        </Text>
        {enrolledClasses.length > 0 ? (
          enrolledClasses.map((classItem) => (
            <View
              key={classItem.id}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => handleClassExpand(classItem.id)}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {classItem.name}
                  </Text>
                  <Text style={{ color: "#666", marginTop: 4 }}>
                    Starting:{" "}
                    {new Date(classItem.startingDate).toLocaleDateString("vi-VN")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 8,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: getStatusColor(
                          classDetails[classItem.id]?.classEnrollments.find(
                            e => e.dogId === dogId)?.status ?? 0),
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "500" }}>
                        {getStatusText(
                          classDetails[classItem.id]?.classEnrollments.find(
                            e => e.dogId === dogId)?.status ?? 0)}
                      </Text>
                    </View>
                  </View>
                </View>
                <MaterialIcons
                  name={
                    expandedClass === classItem.id
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>

              {expandedClass === classItem.id && (
                <View style={{ marginTop: 16 }}>
                  <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginBottom: 16
                  }}>
                    <TouchableOpacity
                      onPress={() => handleProgressReportExpand(classItem.id)}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#e6f3ff",
                        padding: 12,
                        borderRadius: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons
                        name="description"
                        size={20}
                        color="#007AFF"
                      />
                      <Text
                        style={{
                          marginLeft: 8,
                          color: "#007AFF",
                          fontWeight: "500",
                        }}
                      >
                        Progress Reports
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShowCalendar(classItem)}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#e6f3ff",
                        padding: 12,
                        borderRadius: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons
                        name="calendar-today"
                        size={20}
                        color="#007AFF"
                      />
                      <Text
                        style={{
                          marginLeft: 8,
                          color: "#007AFF",
                          fontWeight: "500",
                        }}
                      >
                        Schedule Calendar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleTrainingReportExpand(classItem)}
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#e6f3ff",
                        padding: 12,
                        borderRadius: 8,
                        justifyContent: 'center',
                      }}
                    >
                      <MaterialIcons name="assignment" size={20} color="#007AFF" />
                      <Text style={{ marginLeft: 8, color: "#007AFF", fontWeight: "500" }}>
                        Training Reports
                      </Text>
                    </TouchableOpacity>

                  </View>

                  {expandedReports[classItem.id] &&
                    reportsData[classItem.id] && (
                      <View style={{ marginBottom: 12 }}>
                        {reportsData[classItem.id]?.length > 0 ? (
                          reportsData[classItem.id].map((report, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() =>
                                router.push(`/progress-report/${report.id}`)
                              }
                              style={{
                                backgroundColor: "#f8f9fa",
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 8,
                                borderLeftWidth: 4,
                                borderLeftColor: "#007AFF",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  color: "#333",
                                }}
                              >
                                {new Date(report.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </Text>
                              <Text style={{ color: "#666", marginTop: 4 }}>
                                {formatTime(report.schedule.startTime)} -{" "}
                                {formatTime(report.schedule.endTime)}
                              </Text>
                              <Text style={{ color: "#666", marginTop: 4 }}>
                                Lesson:{" "}
                                {report.lesson ? report.lesson.name : "N/A"}
                              </Text>
                              {report.attendance && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 8,
                                    backgroundColor: "#e8f5e9",
                                    padding: 8,
                                    borderRadius: 6,
                                  }}
                                >
                                  <MaterialIcons
                                    name="check-circle"
                                    size={20}
                                    color="#4caf50"
                                  />
                                  <Text
                                    style={{
                                      marginLeft: 8,
                                      color: "#4caf50",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Attended
                                  </Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          ))
                        ) : (
                          <View
                            style={{
                              padding: 16,
                              backgroundColor: "#f8f9fa",
                              borderRadius: 8,
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons
                              name="assignment-late"
                              size={24}
                              color="#666"
                            />
                            <Text
                              style={{
                                color: "#666",
                                marginTop: 8,
                                textAlign: "center",
                              }}
                            >
                              No progress reports available for this class yet
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  {expandedSlots[classItem.id] && slotsData[classItem.id] && (
                    <View style={{ marginBottom: 12 }}>
                      {slotsData[classItem.id].map((slot, index) => (
                        <View
                          key={index}
                          style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 8,
                            borderLeftWidth: 4,
                            borderLeftColor: "#007AFF",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "#333",
                            }}
                          >
                            {new Date(slot.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </Text>
                          <Text style={{ color: "#666", marginTop: 4 }}>
                            {formatTime(slot.schedule.startTime)} -{" "}
                            {formatTime(slot.schedule.endTime)}
                          </Text>
                          <Text style={{ color: "#666", marginTop: 4 }}>
                            Lesson: {slot.lesson.name}
                          </Text>
                          {slot.attendance && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 8,
                                backgroundColor: "#e8f5e9",
                                padding: 8,
                                borderRadius: 6,
                              }}
                            >
                              <MaterialIcons
                                name="check-circle"
                                size={20}
                                color="#4caf50"
                              />
                              <Text
                                style={{
                                  marginLeft: 8,
                                  color: "#4caf50",
                                  fontWeight: "500",
                                }}
                              >
                                Attended
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {expandedTrainingReports[classItem.id] && (
                    trainingReports[classItem.id]?.length > 0 ? (
                      <View style={{ marginBottom: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 12, color: '#1a1a1a' }}>
                          Training Reports
                        </Text>
                        {trainingReports[classItem.id].map((report, index) => (
                          <View
                            key={index}
                            style={{
                              backgroundColor: "#f8f9fa",
                              borderRadius: 8,
                              padding: 16,
                              marginBottom: 8,
                              borderLeftWidth: 4,
                              borderLeftColor: "#007AFF",
                            }}
                          >
                            <Text style={{ fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 4 }}>
                              {new Date(report.createdTime).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </Text>
                            <Text style={{ color: "#666", marginBottom: 4 }}>
                              Behavior Type: {report.behaviorType}
                            </Text>
                            <Text style={{ color: "#666", marginBottom: 4 }}>
                              Intensity: {report.intensity}/10
                            </Text>
                            <Text style={{ color: "#666", marginBottom: 4 }}>
                              Reaction to Commands: {report.reactionToCommands}/10
                            </Text>
                            <Text style={{ color: "#666", marginBottom: 4 }}>
                              Socialization: {report.socialization}/10
                            </Text>
                            <Text style={{ color: "#666", marginBottom: 4 }}>
                              Stress Level: {report.stressLevel}/10
                            </Text>
                            <Text style={{ color: "#666" }}>
                              Notes: {report.notes || "No notes"}
                            </Text>
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: report.isPassed ? '#e8f5e9' : '#ffebee',
                              padding: 8,
                              borderRadius: 6,
                              marginTop: 8
                            }}>
                              <MaterialIcons
                                name={report.isPassed ? "check-circle" : "cancel"}
                                size={20}
                                color={report.isPassed ? "#4caf50" : "#f44336"}
                              />
                              <Text style={{
                                marginLeft: 8,
                                color: report.isPassed ? "#4caf50" : "#f44336",
                                fontWeight: "500"
                              }}>
                                {report.isPassed ? "Passed" : "Not Passed"}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={{
                        padding: 16,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 8,
                        alignItems: "center",
                        marginBottom: 16,
                      }}>
                        <MaterialIcons name="assignment-late" size={24} color="#666" />
                        <Text style={{ color: "#666", marginTop: 8, textAlign: "center" }}>
                          No training reports available yet
                        </Text>
                      </View>
                    )
                  )}

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {classDetails[classItem.id]?.classSlots.map(
                      (slot, index) => (
                        <View
                          key={index}
                          style={{
                            backgroundColor: "#f8f9fa",
                            borderRadius: 8,
                            padding: 12,
                            marginRight: 12,
                            alignItems: "center",
                            minWidth: 100,
                            borderLeftWidth: 3,
                            borderLeftColor: getSlotStatusColor(slot.status),
                          }}
                        >
                          <MaterialIcons
                            name="event"
                            size={24}
                            color="#007AFF"
                          />
                          <Text style={{ marginTop: 4, fontWeight: "500" }}>
                            {new Date(slot.slotDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </Text>
                          <Text style={{ color: "#666", marginTop: 4 }}>
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </Text>
                          <View
                            style={{
                              backgroundColor: getSlotStatusColor(slot.status),
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 12,
                              marginTop: 4,
                            }}
                          >
                            <Text style={{ color: "white", fontSize: 12, fontWeight: "500" }}>
                              {getSlotStatusText(slot.status)}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                  </ScrollView>

                  {/* Pretest Section */}
                  <View
                    style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: 8,
                      }}
                    >
                      Pretest Information
                    </Text>
                    {classPretests[classItem.id]?.length > 0 ? (
                      classPretests[classItem.id].map((pretest) => (
                        <View
                          key={pretest.id}
                          style={{
                            backgroundColor: "white",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 8,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons
                              name="assignment"
                              size={24}
                              color="#ffA500"
                            />
                            <View style={{ marginLeft: 12 }}>
                              <Text style={{ fontSize: 15, color: "#333" }}>
                                {new Date(pretest.testDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              backgroundColor: getPretestStatusColor(
                                pretest.status
                              ),
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                            }}
                          >
                            <Text style={{ color: "white", fontWeight: "500" }}>
                              {getPretestStatusText(pretest.status)}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View
                        style={{
                          padding: 16,
                          backgroundColor: "white",
                          borderRadius: 8,
                          alignItems: "center",
                        }}
                      >
                        <MaterialIcons
                          name="info-outline"
                          size={24}
                          color="#666"
                        />
                        <Text
                          style={{
                            color: "#666",
                            marginTop: 8,
                            textAlign: "center",
                          }}
                        >
                          No pretests scheduled for this class yet
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Payment Button */}
                  {classPretests[classItem.id]?.some(pretest => pretest.status === 1) &&
                    classDetails[classItem.id]?.classEnrollments?.some(enrollment =>
                      enrollment.dogId === dogId && enrollment.status === 2
                    ) && (
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#34C759",
                          padding: 15,
                          borderRadius: 10,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: 16,
                        }}
                        onPress={() => handlePayment(classItem)}
                      >
                        <MaterialIcons
                          name="payment"
                          size={24}
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          Pay for Class
                        </Text>
                      </TouchableOpacity>
                    )}

                  {classDetails[classItem.id]?.assignedTrainers && (
                    <View
                      style={{
                        marginTop: 16,
                        padding: 12,
                        backgroundColor: "#f8f9fa",
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#333",
                          marginBottom: 8,
                        }}
                      >
                        Assigned Trainers
                      </Text>
                      {classDetails[classItem.id].assignedTrainers.map(
                        (trainer) => (
                          <Text
                            key={trainer.id}
                            style={{ color: "#666", marginBottom: 4 }}
                          >
                            • {trainer.name}
                          </Text>
                        )
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
              backgroundColor: "white",
              borderRadius: 16,
              marginTop: 20,
              elevation: 2,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <MaterialIcons name="school" size={80} color="#007AFF" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#333",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No Classes Yet
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#666",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              This dog is not enrolled in any classes at the moment. Check
              available courses to start the training journey!
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCalendar(false);
          setSelectedDateSlots([]);
        }}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#e0e0e0",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowCalendar(false);
                setSelectedDateSlots([]);
              }}
              style={{ padding: 8 }}
            >
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 8 }}>
              {selectedClass?.name} Schedule
            </Text>
          </View>

          <Calendar
            markedDates={markedDates}
            markingType={"multi-dot"}
            onDayPress={handleDayPress}
            theme={{
              selectedDayBackgroundColor: "#007AFF",
              todayTextColor: "#007AFF",
              dotColor: "#007AFF",
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "500",
            }}
          />

          {selectedDateSlots.length > 0 && (
            <View
              style={{
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: "#e0e0e0",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 12 }}
              >
                Class Times for{" "}
                {new Date(selectedDateSlots[0].slotDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Text>
              {selectedDateSlots.map((slot, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    borderLeftWidth: 3,
                    borderLeftColor: getSlotStatusColor(slot.status),
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="access-time" size={20} color="#007AFF" />
                    <Text style={{ marginLeft: 8, color: "#333", fontSize: 16 }}>
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: getSlotStatusColor(slot.status),
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12, fontWeight: "500" }}>
                      {getSlotStatusText(slot.status)}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Show pretest information if available for the selected date */}
              {selectedClass &&
                classPretests[selectedClass.id]?.some(
                  (pretest) =>
                    new Date(pretest.testDate).toISOString().split("T")[0] ===
                    new Date(selectedDateSlots[0].slotDate)
                      .toISOString()
                      .split("T")[0]
                ) && (
                  <View
                    style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: "#fff4e6",
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MaterialIcons
                        name="assignment"
                        size={20}
                        color="#FF9500"
                      />
                      <Text
                        style={{
                          marginLeft: 8,
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#FF9500",
                        }}
                      >
                        Pretest Scheduled for this day
                      </Text>
                    </View>
                  </View>
                )}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}
