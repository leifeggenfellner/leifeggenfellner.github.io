<!--START_SECTION:waka-->
<!--END_SECTION:waka-->

# Github Actions workshop step-by-step guide

## Prerequisites

1. From your personal github account create a new, empty, **public** repository with the name your_github_username.github.io.

2. You should now see three options on how to set up your repository. Click on the option `Import code` and use the repository url 
https://github.com/acntech/workshop-github-actions.git. Click `Begin import`.

3. Go to the `Settings` page at the top of your repository, choose `Pages` the left side menu, and choose branch `gh-pages` as the source branch, and keep root as the folder. Then click save!

4. Then choose `Actions` and `General`. Under `Action Permissions` select "Allow all actions and reusable workflows" and save. Then scroll down to `Workflow permissions` and select "Read and write permissions" and save again.

Great, now we're ready to start!

## Step 1: The basics 👶

You can find the workflow file in `.github/workflows/build-pipeline.yml`. Github Actions will automatically detect all workflows that are located in this folder.

Let us first start with a little introduction to how a workflow file is set up. The file is written in `YAML` format and stands for *YAML ain’t markup language* (a recursive acronym), which emphasizes that YAML is for data, not documents. Under you can see an example of a `.yaml`/`.yml` file

```yaml
name: This is a workflow

on:
  push:
    branches:
    - master
  pull_request:
    branches:
    - master

jobs:
  print-comment:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "This is a comment"
```

This workflow has the name `This is a workflow` and has only one job that has the name `print-comment`. For more complex workflows you would usally have multiple different `jobs`, and these run in parallell by default Both the name of the workflow and the name of the jobs can be whatever you want. The `on` parameter tells us that this workflow will be triggered every time we push changes or create a pull request to the `master` branch.

One of the nice things about GitHub Actions is that it doesn't just support running builds on Linux hosts, or in containers, but it also provides virtual machines running on Windows and macOS. So if you're building cross-platform applications, you can easily verify your code in different OSs. To specify the host type, you indicate that with the `runs-on` parameter for a job. Here, we are running on a Linux VM by using `
ubuntu-latest`.

Next in the workflow is `steps` which are the building blocks of a job. These are processes that are run in the environement you specified above, and has access to both the filesystem and workspace. The final term we are going to introduce here is `run`. Run triggers command-line programs using the operating system's shell, such as the unix-command `echo`, or trigger a python command such as `pip install`.

## Step 2: Let's build and deploy our code 🚀

Below you can see an example of a job that first checkouts our code, sets up `Node.js` (with stated version), installs all necessary dependencies, then builds our code before deploying it to GitHub pages. GitHub pages lets you easily turn GitHub repositories into websites, which is exactly what we are going to do here. If you want to learn more about GitHub pages check out [this](https://github.com/marketplace/actions/deploy-to-github-pages) documentation.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@4.1.4
        with:
          branch: gh-pages
          folder: dist
```
The parameter `uses` selects an action to run as part of a step in your job. An action is just a reusable unit of code which can be defined in your own repository, in a public repository, or in a published Docker container image. 

In the example above, the deploy step will create a new branch named `gh-pages` that will contain our built code used in deploying our website.

> **Task:** In the file `.github/workflows/build-pipeline.yml`, fill in the necessary information in order to deploy your code every time you push to the `develop` branch. Push your changes to `develop` to see that the workflow runs green in your `Actions` page in the top of your repository. Once green, your website will be available at: *your_github_username.github.io*.
## Step 3: Oh no! Something is wrong with our code 🐛

We now want to add the step of automatically testing our code before we build it. When setting up multiple jobs in a workflow, the jobs run independently of each other, in parallel. Usually, that's ideal. Your jobs will run as soon as machines are available to execute them.

But sometimes you want to be able to set up jobs that depend on other jobs. For example, you might have some services that you want to test against. But to save money, you only want to run those services when you're actually running tests. So you might want to have a job that starts your services, a job that runs your tests, and then a job that stops your services.

To specify dependencies between jobs, you can use the `needs` parameter to indicate what jobs rely on the completion of other jobs. In the example below, `add-beans` must complete successfully before `grind-beans` begins, and `brew-coffee` waits for both `add-beans` and `grind-beans` to complete.

```yaml
jobs:
  add-beans:
  grind-beans:
    needs: add-beans
  brew-coffee:
    needs: [add-beans, grind-beans]
```

> **Task:** Add a job that first checkouts the code, sets up `Node.js`, installs dependencies, and automatically runs all tests using the command `npm run test` before deploying. Make sure that we don't deploy if any test fails. Verify that both your jobs are running successfully by checking the workflow in your `Actions` page.

**Discussion point: What are the benefits of adding this step to our workflow?**

Ever heard about linting before? Well, linting is what makes your code readable, less dependent on who wrote the code, and generally prettier to look at. If you want to learn more about why you should lint, check out [this](https://www.perforce.com/blog/qac/what-lint-code-and-why-linting-important) blogpost.

```yaml
      - name: Run typescript lint and format check
        run: npm run lint:ts
      - name: Run styles lint and format check
        run: npm run lint:css
```
  
> **Task**: Add the steps above for running typescript and css linting to your existing job that contains the testing step. Verify that everything is running successfully by checking the workflow in your `Actions` page.

## Step 4: Environment variables 🍀

Sometimes our action could need input from outside of our workflow to run, which is when we
want to use environment variables. You can define environment variables for a step, job, or
entire workflows. The example below shows how to use environment variables in a step using the `env` parameter.

```yaml
jobs:
  weekday_job:
    runs-on: ubuntu-latest
    steps:
      - name: "Hello world when it's Monday"
        run: echo "Hello $FIRST_NAME $MIDDLE_NAME $LAST_NAME, today is Monday!"
        env:
          FIRST_NAME: Mona
          MIDDLE_NAME: The
          LAST_NAME: Octocat
```
As seen here, if you want to use the value of an environment variable inside a runner, you can use the runner operating system's normal method for reading environment variables. For Linux, we reference environment variables using `$NAME_OF_VARIABLE`.

> **Task**: Add a step to either of your jobs that prints out an environment variable of your choice.

## Step 5: Adding secrets 🤫

Secrets is actually the perfect scenario to use environment variables. You'll often need things like tokens or passwords in deployment scenarios. For instance, if your application needs to log into you bank account to retrieve some information you don't want to have your social security number explicitly stated in your code. This is sensitive information which we normally would want to hide using `secrets`.

To set up a secret, go to your `Repository Settings` page, then select `Secrets and variables` and `actions`. Use the `New repository secret` button to add your secret. Your secret's name will be used in your workflow to reference the data, and you can place the secret itself in the value.
  
To use that secret, you can reference it using the secrets context within your workflow. If you had a secret named `PASSWORD`, you could reference that as `${{secrets.PASSWORD}}`, and store it as an environment variable so that your code can get ahold of it.

> **Task:** Create a secret with name `PASSWORD`. In the same step as for the previous task,assign the secret's value to the environment variable `SECRET`. What happens if you try to print out the secret. *NB: Although this variable does not have a concrete usecase yet, we will actually apply it in Step 6, where you can choose to integrate with Docker hub.*

## Step 6: Pushing a Docker image to Docker Hub 🐳
Docker has become a quintessential element of modern software development, and let's you build and ship your code easier than ever. This is accomplished by creating an image, more specificely a Docker image, which contains everything that is needed for your application to run, e.g. operating system, dependecies, and your code. This image can then be used to create indentical deployments to different servers, without you as a developer having to worry if your code is going to behave differently.

In the same way we can push our code to Github repository, Docker provides a repository to store all our Docker images. This is known as Docker Hub. A handy option is therefore to push a new Docker image to Docker Hub, each time we merge and release a new version of our code. Luckily this operation can be automated using Github actions, and is what you are to accomplish in this task.

To create a Docker image we use a Dockerfile. We have included a dummy Dockerfile in the repository which can be used for this task, however, if you are feeling adventures and are familiar with Docker, you can of course modify it. 

To be able to complete this task, you will need
1. A Docker Hub account - This can be created for free [here](https://hub.docker.com/signup)
2. A Docker repository - This can be created by following [this guide](https://docs.docker.com/docker-hub/quickstart/)

In the script that we are going to create, you need to use both your Docker Hub username and password. As was dicussed in Step 5, we do not want usernames or passwords our code, and we will therefore once again use Secrets.

>**Task 1:** Create two `secrets` in your repository called DOCKER_USERNAME and DOCKER_PASSWORD, which contains your Docker username and password. Create a new job and then create a step in your workflow using `docker/login-action@v1` to log into Docker Hub in your workflow. 

Next we need to tell Docker Hub where we want to store our Docker image. 

>**Task 2:** Create a step using `docker/metadata-action@v3`, where you specify the namespace and image name, e.g. my-name-space/favorite-image

Finally we want to push the Docker image to Docker Hub.

>**Task 3:** Use `docker/build-push-action@v2` to push our Docker image to Docker Hub. Make sure you include both labels and tags

With your current setup you push to Docker Hub each time you create a pull request or merge, can you think of a way we can make sure we only push to Docker hub when we merge? 💭

## Step 7: You are becoming a pro, time to explore Github Marketplace 🌈
You're now able to automatically check linting and testing before deploying your code. And you didn't have to do anything except push your code!

In the same way there are libraries for almost any usecase when you write code, there are thousand of Github Actions already created for you to utilize. To continue to improve your repository go to the [Github Marketplace](https://github.com/marketplace?category=&query=sort%3Apopularity-desc&type=actions&verification=), find an action you like, and try to incorporate it into you repository. There are sooo many options. For instance,

### Send e-mail notification when a workflow fails/succeeds 📫
Check out [this](https://github.com/marketplace/actions/send-email) action if you want to send an e-mail notification to your gmail account when your workflow fails and/or succeeds. **Note** if you have set up 2FA (Two Factor Authentication) on your email, this action won't work.

### Get awesome development stats in README ✨
Are you an earlybird or a nightowl? When are you most productive during the day? What are the languages you code in? You can add such fun stats in your `README.md` file using [this](https://github.com/marketplace/actions/profile-readme-development-stats) action.

### Set a timing for when a deploy should be set ⏰
Sometimes we want to deploy regurarly and not just when a defined action, such as pushing our code, happens. We can use the `schedule` parameter for this as shown in [this](https://docs.github.com/en/actions/guides/scheduling-issue-creation) documentation.
