import { catchASyncError } from "../middlewares/catchASyncError.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/userSchema.js";
import { sendToken } from "../utils/jwtTokens.js";
import {Articals} from "../models/ArticalSchema.js"; 

export const ArticalPost = catchASyncError(async (req, res, next) => {
    const { email } = req.body;
    console.log("email", email);
    const { name, title, content,description} = req.body;
    const postedBy = req.user.id;
    // Validate fields
    if (!name || !title || !content ||!description) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }

    try {
        
      

        // Create new article and save it to the database
        const article = await  Articals.create({
            name,
            title,
            content,
            postedBy,
            description,
        });
         

        // Send token with response (if needed)
        // const token = sendToken(user._id);

        res.status(201).json({ success: true, message: "Article created successfully" });
    } catch (error) {
        // Handle errors
        next(error);
    }
});

//get all articles

export const ArticalGet=catchASyncError(async(req, res, err,next)=>{
    const articals = await Articals.find();
    res.status(200).json(articals);
});

export const ArticalGetTop3 = catchASyncError(async (req, res, next) => {
    try {
        const articles = await Articals.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        console.log(articles, "hello articles ");
        
        res.status(200).json({
            articles: articles.map(article => ({
                title: article.title,
                description: article.description
            }))
        });
    } catch (error) {
        next(error);
    }
});


// get single article by id  
export const ArticleIdGet = (req, res, next) => {
    const id = req.params;
    Articals.findById(id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

//update an article     
// export const ArticalUpdate = async (req, res, next) => {
//     try {
//         const _id = req.params;
//         console.log(_id);
//         const article = await Articals.findById(_id);
//         if (!article) {
//             return res.status(404).json({ error: 'Article not found' });
//         }
        
//         if (article.postedBy.toString() !== req.user.id) {
//             return res.status(403).json({ error: 'Unauthorized' });
//         }
//         const artical = await Articals.findByIdAndUpdate(id, req.body, { new: true });
//         res.status(200).json({
//             artical,
//             message: "Update successfully",
//         });
//     } catch (err) {
//         next(err); 
//     }
// };
export const ArticalUpdate = async (req, res, next) => {
    try {
        const { id } = req.params; // Extracting the id using object destructuring
        const article = await Articals.findById(id); // Finding the article by id
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        
        if (article.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const updatedArticle = await Articals.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            article: updatedArticle, // Corrected variable name
            message: "Update successfully",
        });
    } catch (err) {
        next(err); 
    }
};

//delete a specific article 

// export const ArticalDelete = async (req, res, next) => {
//     const id = req.params;  
//     console.log(req.params)
//     console.log(id);
//     console.log(req.user.id);
    
//     try {
//         const article = await Articals.findById(id);
//         if (!article) {
//             return res.status(404).json({ error: 'Article not found' });
//         }

//         // Check if the author of the article matches the currently authenticated user
//         if (article.postedBy.toString() !== req.user.id) {
//             return res.status(403).json({ error: 'Unauthorized' });
//         }

//         // If the author matches, proceed with deletion
//         await Articals.findByIdAndDelete(id);
//         res.status(200).json("Article deleted");
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };
export const ArticalDelete = async (req, res, next) => {
    try {
        const { id } = req.params; // Extracting the id using object destructuring
        console.log(req.params);
        console.log(id);
        console.log(req.user.id);
        
        const article = await Articals.findById(id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Check if the author of the article matches the currently authenticated user
        if (article.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // If the author matches, proceed with deletion
        await Articals.findByIdAndDelete(id);
        res.status(200).json("Article deleted");
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const ArticalLike = (req, res, next) => {
    const id = req.params;
    Articals.findById(id)
        .then((artical) => {
            artical.likes = artical.likes + 1;
            artical.save()
                .then(() => {
                    res.status(200).json("Artical liked");
                })
                .catch((err) => {
                    res.status(400).json({ error: err });
                });
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const getSingleArtical = catchASyncError(async (req, res, next) => {
    const { id } = req.params;
    console.log("id: getSingleArtical", id);
    try {
        const Artical = await Articals.findById(id);
        console.log("Articals:", Artical);
        if (!Artical) {
            // return next(new ErrorHandler("Job not found.", 404));
            return res.status(404).json({
                success: false,
                message: "Articals not found.",
            });
        }
        res.status(200).json({
            success: true,
            Artical,
        });
    } catch (error) {
        console.log("error:", error);
        // return next(new ErrorHandler(`Invalid ID / CastError`, 404));
        return res.status(404).json({
            success: false,
            message: `Invalid ID / CastError`,
        });
    }
});

//////find my artical

export const getMyArtical = async (req, res, next) => {
    try {
        const user = req.user;
        console.log("user:", req.user._id);
        const article = await Articals.find({ postedBy: req.user._id });
        res.status(200).json({
            success: true,
            article,
        });
    } catch (err) {
        next(err);
    }
};

