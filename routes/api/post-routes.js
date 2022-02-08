const router = require("express").Router();
const { Post, User, Comment, Vote } = require("../../models");
const { sequelize } = require("../../models/Post");

// get all users
router.get("/", (req, res) => {
  Post.findAll({
    order: [["created_at", "DESC"]],
    attributes: ["id", "post_url", "title", "created_at",
    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'create_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "post_url", "title", "created_at",[sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
  Post.upvote(req.body, { Vote })
    .then(updatePostData => res.json(updatePostData))
    .catch(err => {
    console.log(err);
    res.status(400).json(err)
    });
  // Vote.create({
  //   user_id: req.body.user_id,
  //   post_id: req.body.post_id
  // }).then(() => {
  //   // then find the post we just voted on
  //   return Post.findOne({
  //     where: {
  //       id: req.body.post_id
  //     },
  //     attributes: [
//         'id',
//         'post_url',
//         'title',
//         'created_at',
//         // use raw mysql aggregate function query to get a count of how many votes the post has and return it under the 'vote_count'
//         [
//           sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post)'),
//           'vote_count'
//         ]
//       ]
//     })
//   })
//   .then(dbPostData => res.json(dbPostData))
//   .catch(err => res.json(err));
});

router.put("/:id", (req, res) => {
  Post.update(
    {
      title: req.body.title,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
