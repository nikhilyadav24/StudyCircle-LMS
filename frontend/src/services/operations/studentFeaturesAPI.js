import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_ENROLL_API } = studentEndpoints;

// ================ Direct Course Enrollment (Free) ================ 
export async function enrollCourseDirectly(token, coursesId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Enrolling in course...");

    try {
        console.log('=== DIRECT ENROLLMENT STARTED ===');
        console.log('Courses to enroll:', coursesId);
        console.log('User:', userDetails);

        // Call the enrollment API directly
        const response = await apiConnector("POST", COURSE_ENROLL_API, { coursesId }, {
            Authorization: `Bearer ${token}`,
        });

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        // Success - course enrolled
        toast.success("Course enrolled successfully!");
        console.log("Course enrolled successfully:", response.data);
        
        // Clear cart if enrolling from cart
        if (coursesId.length > 1) {
            dispatch(resetCart());
        }
        
        // Navigate to enrolled courses
        navigate("/dashboard/enrolled-courses");
        
    } catch (error) {
        console.log("DIRECT ENROLLMENT ERROR.....", error);
        toast.error(error.response?.data?.message || "Failed to enroll in course");
    }
    
    toast.dismiss(toastId);
}

// ================ buyCourse ================ 
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
    // Direct enrollment - no payment required
    await enrollCourseDirectly(token, coursesId, userDetails, navigate, dispatch);
}