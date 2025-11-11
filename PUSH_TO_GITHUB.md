# Push to GitHub Instructions

## Step 1: Create GitHub Repositories

Go to https://github.com/new and create TWO new repositories:

### Repository 1: course-builder
- Name: `course-builder`
- Description: "Lightweight GUI for creating modular educational courses with MECS standard support"
- Public or Private: Your choice
- DO NOT initialize with README (we already have one)

### Repository 2: mecs-standard
- Name: `mecs-standard`
- Description: "Modular Educational Content Standard - Open JSON specification for educational content"
- Public (recommended for standards)
- DO NOT initialize with README (we already have one)

## Step 2: Push course-builder

```bash
cd ~/git/course-builder
git remote add origin https://github.com/mikhaidn/course-builder.git
git branch -M main
git push -u origin main
```

## Step 3: Push mecs-standard

```bash
cd ~/git/mecs-standard
git remote add origin https://github.com/mikhaidn/mecs-standard.git
git branch -M main
git push -u origin main
```

## Alternative: Use SSH

If you prefer SSH authentication:

```bash
# course-builder
cd ~/git/course-builder
git remote add origin git@github.com:mikhaidn/course-builder.git
git push -u origin main

# mecs-standard
cd ~/git/mecs-standard
git remote add origin git@github.com:mikhaidn/mecs-standard.git
git push -u origin main
```

## Verification

After pushing, verify:
1. Both repos are visible on GitHub at:
   - https://github.com/mikhaidn/course-builder
   - https://github.com/mikhaidn/mecs-standard
2. All files are present
3. READMEs display correctly
4. Links between repos work

---

**Your repositories are ready to push!** All URLs have been updated with username: mikhaidn
